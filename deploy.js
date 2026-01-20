import { copyFileSync, existsSync, mkdirSync, cpSync } from "fs";
import { execSync } from "child_process";
import path from "path";

// Your LocalWP site path
const WP_PLUGIN_PATH =
  "C:/Users/thisw/Local Sites/seolite/app/public/wp-content/plugins/lightSEO";

console.log("🚀 Deploying to WordPress...");
console.log(`📍 Target: ${WP_PLUGIN_PATH}`);

try {
  // Create plugin directory if it doesn't exist (don't delete if it does)
  if (!existsSync(WP_PLUGIN_PATH)) {
    mkdirSync(WP_PLUGIN_PATH, { recursive: true });
    console.log("📁 Created plugin directory");
  } else {
    console.log("📁 Using existing plugin directory (will overwrite files)");
  }

  // Copy main plugin file
  if (existsSync("wp-seo-plugin.php")) {
    copyFileSync(
      "wp-seo-plugin.php",
      path.join(WP_PLUGIN_PATH, "wp-seo-plugin.php"),
    );
    console.log("✅ Copied wp-seo-plugin.php");
  } else {
    console.log("⚠️ wp-seo-plugin.php not found!");
    process.exit(1);
  }

  // Copy includes directory if it exists
  if (existsSync("includes")) {
    // Create includes dir if needed
    const includesPath = path.join(WP_PLUGIN_PATH, "includes");
    if (!existsSync(includesPath)) {
      mkdirSync(includesPath, { recursive: true });
    }

    cpSync("includes", includesPath, {
      recursive: true,
      force: true, // Overwrite existing files
    });
    console.log("✅ Copied includes/");
  } else {
    console.log("⚠️ includes/ directory not found - creating it...");
    mkdirSync(path.join(WP_PLUGIN_PATH, "includes"), { recursive: true });
  }

  // Build assets if not already built
  if (!existsSync("dist")) {
    console.log("🔨 Building assets...");
    try {
      execSync("npm run build", { stdio: "inherit" });
      console.log("✅ Build completed");
    } catch (error) {
      console.log("❌ Build failed!");
      process.exit(1);
    }
  }

  // Copy dist directory
  if (existsSync("dist")) {
    const distPath = path.join(WP_PLUGIN_PATH, "dist");
    if (!existsSync(distPath)) {
      mkdirSync(distPath, { recursive: true });
    }

    cpSync("dist", distPath, {
      recursive: true,
      force: true, // Overwrite existing files
    });
    console.log("✅ Copied dist/");
  } else {
    console.log("⚠️ dist/ not found - run 'npm run build' first!");
    process.exit(1);
  }

  console.log("\n🎉 Deploy complete!");
  console.log("\n✨ Next steps:");
  console.log("1. Go to WordPress admin");
  console.log(
    "2. If the plugin is already activated, deactivate and reactivate it",
  );
  console.log("3. Or just refresh the SEO Plugin page");
  console.log("\n💡 Plugin should now be at: Plugins → lightSEO");
} catch (error) {
  console.error("❌ Deploy failed:", error.message);
  console.log("\n💡 Troubleshooting:");
  console.log("- Make sure LocalWP site is running");
  console.log("- Check that the path exists: " + WP_PLUGIN_PATH);
  console.log("- Try closing any file explorers viewing the plugins folder");
  process.exit(1);
}
