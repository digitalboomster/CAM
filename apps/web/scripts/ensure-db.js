"use strict";
const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");

const dbPath = path.join(__dirname, "..", "prisma", "dev.db");
if (!fs.existsSync(dbPath)) {
  console.log("[ensure-db] No database found. Running db:setup…");
  const r = spawnSync("npm", ["run", "db:setup"], {
    stdio: "inherit",
    cwd: path.join(__dirname, ".."),
    shell: true,
  });
  if (r.status !== 0) process.exit(r.status ?? 1);
}
