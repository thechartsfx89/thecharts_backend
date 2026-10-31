export default (plugin: any) => {
  const registerRoute = plugin.routes["content-api"].routes.find(
    (r: any) => r.method === "POST" && r.path === "/auth/local/register"
  );

  if (!registerRoute) return plugin;

  registerRoute.config.middlewares =
    registerRoute.config.middlewares || [];

  registerRoute.config.middlewares.push(async (ctx:any, next:any) => {
    const { referralByCode } = ctx.request.body;
    console.log("📝 Registration intercepted. Referral code:", referralByCode, ctx.request.body);
    // 🚀 Let Strapi create the user first
    await next();

    if (ctx.response.status !== 200 || !ctx.body?.user) return;

    const child = ctx.body.user;
   
    let parent = null;
    if (referralByCode) {
      parent = await strapi.db
        .query("plugin::users-permissions.user")
        .findOne({
          where: {
            username: referralByCode,
            blocked: false,
        },
        select: [
          "id",
          "username",
          "email",
          "hasPurchasedCourse",
          "confirm_affiliate_payment",
          "directReferralCount",
          "totalReferralCount",
        ],
      });
    }
    // console.log("📝 Referred by user:", parent);
    if (!parent || parent.id === child.id) return;

    await strapi.service("api::affiliate.affiliate")
      .handleUserAffiliateFlow({
        parentId: parent.id,
        childId: child.id,
      });
  });

  return plugin;
};