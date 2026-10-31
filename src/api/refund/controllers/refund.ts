import { factories } from "@strapi/strapi";
import { refundTemplate } from "../../../utils/email-templates/refund";
// import { refundAcknowledgementTemplate } from "../../../utils/email-templates/refundAck";

export default factories.createCoreController("api::refund.refund", ({ strapi }) => ({

    async create(ctx) {
        // 1️⃣ Create refund entry
        const createResponse = await super.create(ctx);

        const refundId = createResponse.data.id;
        console.log({ createResponse })
        // 2️⃣ Re-fetch refund with user relation using new Strapi v5 query engine
        const refundEntry = await strapi.db.query("api::refund.refund").findOne({
            where: { id: refundId },
            populate: {
                user: {
                    select: ["email", "username"],
                },
                course: {
                    populate: {
                        course: { select: ["course_title", "course_price"] },
                    },
                },
                payment: {
                    select: ["*"]
                },
            },
        });

        console.log("Refund With User →", refundEntry);

        try {
            const userEmail = refundEntry?.user?.email;
            const userName = refundEntry?.user?.username || "User";

            if (!userEmail) {
                console.warn("Refund created but user email missing");
                return createResponse;
            }

            // 3️⃣ Prepare email template
            const template = refundTemplate(
                userName,
                refundEntry.documentId,
                refundEntry.course.course.course_price,
                refundEntry.course.course.course_title
            );

            // 4️⃣ Send the email
            await strapi.plugins["email"].services.email.send({
                to: userEmail,
                subject: template.subject,
                html: template.html,
            });

            console.log("Refund acknowledgement email sent");
        } catch (err) {
            console.error("Email sending failed:", err);
        }

        return createResponse;
    },

}));
