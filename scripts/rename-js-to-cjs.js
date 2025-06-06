import fs from "fs";
import path from "path";

const dir = path.resolve(process.cwd(), "dist-electron");

function renameJsToCjs(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      renameJsToCjs(fullPath);
    } else if (file.endsWith(".js")) {
      fs.renameSync(fullPath, fullPath.replace(/\.js$/, ".cjs"));
    }
  }
}

renameJsToCjs(dir);
