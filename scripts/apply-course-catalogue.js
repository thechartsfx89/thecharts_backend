'use strict';

/**
 * One-off rollout of the new course catalogue. Safe to run repeatedly.
 *
 *   node scripts/apply-course-catalogue.js           # dry run: prints the plan, changes no course or payment
 *   node scripts/apply-course-catalogue.js --apply   # writes to the DATABASE_* set in .env
 *
 * Deploy the backend first. Loading Strapi, even for a dry run, syncs the content-type schema to that
 * database and runs the bootstrap in src/index.ts, exactly as starting the server does.
 *
 * Steps, in order:
 *  1. Freeze existing payments: copies today's rupee price onto each payment with no recorded
 *     amount, so changing course_price cannot rewrite past invoices.
 *  2. Updates Foundation and renames Full Course to Advanced Course.
 *  3. Creates Premium Course, News Trading and One-to-One Membership.
 *
 * Offline Class is not changed: the frontend stops selling courses flagged offline_course,
 * while its existing students keep access to their purchase.
 *
 * Prices here must match thechartsfx_frontend/utils/course-catalogue.ts.
 */

const { compileStrapi, createStrapi } = require('@strapi/strapi');

const LECTURE = 'api::recorderd-lecture.recorderd-lecture';
const PAYMENT = 'api::payment.payment';
const APPLY = process.argv.includes('--apply');

const EXISTING = [
  { documentId: 'w4v2ac64489eegvefk0fjwbv', catalogue_key: 'foundation', course_title: 'Foundation Course', regular_price: 600, course_price: 499 },
  { documentId: 'yijrnm2mbfm4rxxm5mumf0gb', catalogue_key: 'advanced', course_title: 'Advanced Course', regular_price: 799, course_price: 599 },
];

const NEW_COURSES = [
  {
    catalogue_key: 'premium',
    course_title: 'Premium Course',
    regular_price: 1199,
    course_price: 999,
    course_desc: 'Everything in the Advanced Course, including all video access, plus weekly live trading sessions and access to our trading community.',
  },
  {
    catalogue_key: 'news_trading',
    course_title: 'News Trading',
    regular_price: 100,
    course_price: 100,
    course_desc: 'Complete fundamental analysis, live trading sessions on news events, and a backtested review of the important news events of the previous three years.',
  },
  {
    catalogue_key: 'one_to_one',
    course_title: 'One-to-One Membership',
    regular_price: 199,
    course_price: 160,
    course_desc: 'Personal membership with one-to-one access.',
  },
];

// USD prices carry no GST breakdown until tax treatment is confirmed
const priceFields = (course) => ({
  catalogue_key: course.catalogue_key,
  course_title: course.course_title,
  regular_price: course.regular_price,
  course_price: course.course_price,
  mrp: course.course_price,
  gst: null,
  cgst: null,
  sgst: null,
});

async function freezePaymentAmounts(strapi) {
  const payments = await strapi.db.query(PAYMENT).findMany({
    where: { total_amount: { $null: true } },
    select: ['id'],
    populate: {
      course: { select: ['course_price', 'mrp', 'gst', 'cgst', 'sgst'] },
      purchased_course: { populate: { course: { select: ['course_price', 'mrp', 'gst', 'cgst', 'sgst'] } } },
    },
  });

  let frozen = 0;
  let skipped = 0;
  for (const payment of payments) {
    const course = payment.course ?? payment.purchased_course?.course;
    if (!course) {
      skipped++;
      continue;
    }
    if (APPLY) {
      // updateMany does not fire the afterUpdate hook that runs commissions and admissions
      await strapi.db.query(PAYMENT).updateMany({
        where: { id: payment.id },
        data: {
          total_amount: course.course_price,
          base_price: course.gst ? course.mrp : course.course_price,
          gst: course.gst,
          cgst: course.cgst,
          sgst: course.sgst,
          currency: 'INR',
        },
      });
    }
    frozen++;
  }
  console.log(`Payments: ${frozen} frozen at their rupee price, ${skipped} skipped (no course linked).`);
}

async function updateExistingCourses(strapi) {
  for (const course of EXISTING) {
    const current = await strapi.documents(LECTURE).findOne({ documentId: course.documentId, status: 'published' });
    if (!current) {
      throw new Error(`Course ${course.documentId} (${course.course_title}) not found; stopping before any price changes.`);
    }
    console.log(`Update "${current.course_title}" (${current.course_price}) -> "${course.course_title}" ($${course.course_price}, was $${course.regular_price})`);
    if (APPLY) {
      await strapi.documents(LECTURE).update({ documentId: course.documentId, data: priceFields(course) });
      await strapi.documents(LECTURE).publish({ documentId: course.documentId });
    }
  }
}

async function createNewCourses(strapi) {
  const advanced = await strapi.documents(LECTURE).findOne({
    documentId: EXISTING[1].documentId,
    status: 'published',
    populate: ['course_thumbnail'],
  });

  for (const course of NEW_COURSES) {
    const existing = await strapi.documents(LECTURE).findFirst({ filters: { catalogue_key: course.catalogue_key } });
    if (existing) {
      console.log(`Skip "${course.course_title}": already exists (${existing.documentId}).`);
      continue;
    }
    console.log(`Create "${course.course_title}" ($${course.course_price}, was $${course.regular_price})`);
    if (APPLY) {
      await strapi.documents(LECTURE).create({
        status: 'published',
        data: {
          ...priceFields(course),
          course_desc: course.course_desc,
          // Both are required by the schema; replace these placeholders in the admin panel
          video_url: advanced?.video_url ?? 'pending',
          module_id: `catalogue-${course.catalogue_key}`,
          course_thumbnail: advanced?.course_thumbnail?.id ?? null,
        },
      });
    }
  }
}

async function main() {
  const strapi = await createStrapi(await compileStrapi()).load();
  const exit = (code) => strapi.destroy().finally(() => process.exit(code));

  console.log(APPLY ? `APPLYING to database "${process.env.DATABASE_NAME}"` : 'DRY RUN: nothing will be written. Pass --apply to write.');
  try {
    await freezePaymentAmounts(strapi);
    await updateExistingCourses(strapi);
    await createNewCourses(strapi);
    console.log('Done.');
    await exit(0);
  } catch (err) {
    console.error('Stopped:', err.message);
    await exit(1);
  }
}

main();
