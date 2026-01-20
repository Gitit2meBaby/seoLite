import { existsSync, readdirSync } from "fs";
import { join } from "path";
import { homedir } from "os";

console.log("🔍 Looking for LocalWP sites...");

const possiblePaths = [
  join(homedir(), "Local Sites"),
  join(homedir(), "Library", "Application Support", "Local", "sites"),
  join(homedir(), "AppData", "Roaming", "Local", "sites"), // Windows
  "/Applications/Local.app/Contents/Resources/sites", // Alternative Mac location
];

for (const basePath of possiblePaths) {
  console.log(`\n📁 Checking: ${basePath}`);

  if (existsSync(basePath)) {
    console.log("✅ Found LocalWP directory!");

    try {
      const sites = readdirSync(basePath);
      console.log("🌐 Available sites:");

      sites.forEach((site) => {
        const sitePath = join(basePath, site);
        const wpPath = join(sitePath, "app", "public", "wp-content", "plugins");

        if (existsSync(wpPath)) {
          console.log(`  ✅ ${site} → ${wpPath}`);
        } else {
          console.log(`  ❌ ${site} (no wp-content found)`);
        }
      });
    } catch (error) {
      console.log("❌ Could not read directory contents");
    }
  } else {
    console.log("❌ Directory not found");
  }
}

console.log(
  "\n💡 If you found your site above, copy the path and update your deploy script!"
);
console.log(
  "💡 Or use LocalWP's 'Reveal in Finder' option to find the exact path."
);
