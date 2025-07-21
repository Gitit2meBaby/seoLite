// deploy.js - Place in your VSCode project root
const fs = require("fs-extra");
const path = require("path");

const sourceDir = __dirname;
const wpPluginDir = "/path/to/wordpress/wp-content/plugins/wp-seo-plugin";

async function deploy() {
  console.log("Building assets...");
  await require("child_process").execSync("npm run build");

  console.log("Copying files to WordPress...");

  // Copy PHP files
  await fs.copy(
    path.join(sourceDir, "wp-seo-plugin.php"),
    path.join(wpPluginDir, "wp-seo-plugin.php")
  );
  await fs.copy(
    path.join(sourceDir, "includes"),
    path.join(wpPluginDir, "includes")
  );

  // Copy built assets
  await fs.copy(path.join(sourceDir, "dist"), path.join(wpPluginDir, "dist"));

  console.log("✅ Deployed to WordPress!");
}

deploy().catch(console.error);
