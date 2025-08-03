import { copyFileSync, existsSync, mkdirSync, cpSync, rmSync } from "fs";
import { execSync } from "child_process";
import path from "path";

// Your LocalWP site path
const WP_PLUGIN_PATH =
  "/Users/danielthomas/Local Sites/lightseo/app/public/wp-content/plugins/wp-seo-plugin";

console.log("🚀 Deploying to WordPress...");
console.log(`📍 Target: ${WP_PLUGIN_PATH}`);

try {
  // Remove old plugin directory to ensure clean deployment
  if (existsSync(WP_PLUGIN_PATH)) {
    console.log("🗑️  Removing old plugin files...");
    rmSync(WP_PLUGIN_PATH, { recursive: true, force: true });
  }

  // Create fresh plugin directory
  mkdirSync(WP_PLUGIN_PATH, { recursive: true });
  console.log("📁 Created fresh plugin directory");

  // Copy main plugin file
  if (existsSync("wp-seo-plugin.php")) {
    copyFileSync(
      "wp-seo-plugin.php",
      path.join(WP_PLUGIN_PATH, "wp-seo-plugin.php")
    );
    console.log("✅ Copied wp-seo-plugin.php");
  } else {
    console.log("⚠️ wp-seo-plugin.php not found!");
    process.exit(1);
  }

  // Copy includes directory if it exists
  if (existsSync("includes")) {
    cpSync("includes", path.join(WP_PLUGIN_PATH, "includes"), {
      recursive: true,
    });
    console.log("✅ Copied includes/");
  } else {
    console.log("⚠️ includes/ directory not found - creating it...");
    mkdirSync(path.join(WP_PLUGIN_PATH, "includes"), { recursive: true });
  }

  // Build assets if they exist
  if (existsSync("assets") && existsSync("package.json")) {
    console.log("🔨 Building assets...");
    try {
      execSync("npm run build", { stdio: "inherit" });
      console.log("✅ Build completed");
    } catch (error) {
      console.log("⚠️ Build failed, continuing without built assets");
    }

    // Copy dist directory if it exists
    if (existsSync("dist")) {
      cpSync("dist", path.join(WP_PLUGIN_PATH, "dist"), { recursive: true });
      console.log("✅ Copied dist/");
    } else {
      console.log("⚠️ dist/ not found - assets may not be built");
    }
  }

  // Copy debug plugin
  if (existsSync("debug-paths.php")) {
    const debugPath =
      "/Users/danielthomas/Local Sites/lightseo/app/public/wp-content/plugins/debug-paths";
    if (!existsSync(debugPath)) {
      mkdirSync(debugPath, { recursive: true });
    }
    copyFileSync("debug-paths.php", path.join(debugPath, "debug-paths.php"));
    console.log("✅ Copied debug-paths.php");
  }

  console.log("\n🎉 Deploy complete!");

  // List what was deployed
  console.log("\n📋 Deployed files:");
  if (existsSync(WP_PLUGIN_PATH)) {
    const { readdirSync, statSync } = await import("fs");
    const listFiles = (dir, prefix = "") => {
      const items = readdirSync(dir);
      items.forEach((item) => {
        const fullPath = path.join(dir, item);
        const isDir = statSync(fullPath).isDirectory();
        console.log(`${prefix}${isDir ? "[DIR]" : "[FILE]"} ${item}`);
        if (isDir && item !== "node_modules") {
          listFiles(fullPath, prefix + "  ");
        }
      });
    };
    listFiles(WP_PLUGIN_PATH);
  }

  console.log("\n💡 Now refresh your WordPress admin page!");
} catch (error) {
  console.error("❌ Deploy failed:", error.message);
  console.log("💡 Make sure LocalWP is running and the path is correct!");
}
