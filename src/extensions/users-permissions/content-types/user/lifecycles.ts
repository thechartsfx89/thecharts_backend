export default {
  async afterCreate(event: any) {
    console.log("🔥 USER LIFECYCLE TRIGGERED 🔥");
    console.log("USER ID:", event.result?.id);
  },
};
