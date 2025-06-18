// build.mjs
import fs from "fs/promises";
import { exec } from "child_process";

const original = await fs.readFile("package.json", "utf-8");
const modified = JSON.parse(original);
modified.type = "module";
await fs.writeFile("package.build.json", JSON.stringify(modified, null, 2));

await fs.rename("package.json", "package.backup.json");
await fs.rename("package.build.json", "package.json");

exec("vite build", async (err, stdout, stderr) => {
  console.log(stdout);
  console.error(stderr);
  // Restore original package.json
  await fs.rename("package.json", "package.build.json");
  await fs.rename("package.backup.json", "package.json");
});
