const Strapi = require('@strapi/strapi');

async function run() {
  console.log("🚀 Initializing Strapi...");
  
  // Handle different export styles
  const strapiFactory = typeof Strapi === 'function' ? Strapi : Strapi.default;

  if (typeof strapiFactory !== 'function') {
    console.error("❌ Could not find Strapi factory function. Check your @strapi/strapi version.");
    process.exit(1);
  }

  // Initialize and Load Strapi (this creates the global.strapi object)
  // We use distDir: './dist' because your project is likely compiled TypeScript
  const app = await strapiFactory({ distDir: './dist' }).load();

  const script = require('./scripts/fix-all-affiliates.js');
  
  console.log("📂 Running Affiliate Migration Script...");
  
  try {
    // Pass the global strapi instance to your script
    await script({ strapi: global.strapi });
    console.log("🏁 Script execution finished.");
  } catch (err) {
    console.error("❌ Script Error:", err);
  }

  process.exit(0);
}

run();