"use strict";
const axios = require("axios");

module.exports = {
  async receive(ctx) {
    try {
      const token = ctx.query.token;
      if (token !== process.env.VDOCIPHER_WEBHOOK_TOKEN) {
        return ctx.unauthorized("Invalid token");
      }

      // Respond quickly to prevent webhook retries
      ctx.send({ success: true });

      const payload = ctx.request.body;
      console.log({ payload });

      const video = payload?.payload || payload;
      const videoId = video?.id;

      if (!videoId) {
        strapi.log.warn("⚠️ Missing videoId in VdoCipher payload");
        return;
      }

      // Prepare data for your collection
      const data = {
        vdo_id: videoId,
        course_title: video.title,
        posters: video.posters,
        folderPath: video.folderPath,
        course_desc: "",
        length: video.length,
        video_url: "https://dev.vdocipher.com/api/videos/" + videoId, // replace with your real URL if available
      };

      // Check if a record already exists with this VdoCipher ID
      const existing = await strapi.db
        .query("api::recorderd-lecture.recorderd-lecture")
        .findOne({ where: { vdo_id: videoId } });
      console.log({existing})
      if (existing) {
        await strapi.db
          .query("api::recorderd-lecture.recorderd-lecture")
          .update({
            where: { id: existing.id },
            data,
          });

        strapi.log.info(`🔄 Updated recorded lecture: ${video.title}`);
      } else {
        await strapi.db
          .query("api::recorderd-lecture.recorderd-lecture")
          .create({ data });

        strapi.log.info(`✅ Created recorded lecture: ${video.title}`);
      }
    } catch (err) {
      strapi.log.error("❌ VdoCipher webhook error:", err);
    }
  },
};
