module.exports = async (policyContext, config, { strapi }) => {
  const { user } = policyContext.state;
  if (!user) return false;

  const moduleNumber = Number(policyContext.request.query.module);
  if (!moduleNumber) return false;

  // Module 1 is always available
  if (moduleNumber === 1) return true;

  // Fetch previous quiz result
  const prevQuiz = await strapi.db.query("api::quiz-score.quiz-score").findOne({
    where: {
      user: user.id,
      module_number: moduleNumber - 1
    }
  });

  if (!prevQuiz) return false;

  const percentage = (prevQuiz.score / prevQuiz.total) * 100;

  return percentage >= 60;
};
