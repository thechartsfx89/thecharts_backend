async function resolveActiveClubs(userId: number) {
  return await strapi
    .documents("api::user-club-status.user-club-status")
    .findMany({
      filters: {
        user: { id: userId },
        isActive: true,
        expiresAt: { $gt: new Date() },
      },
      populate: ["club"],
    });
}
export default () => ({
  resolveActiveClubs,
});