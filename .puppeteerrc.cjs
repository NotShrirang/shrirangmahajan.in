const { join } = require("path");

/*
 * Keep Puppeteer's Chrome download inside the project.
 *
 * By default it lands in ~/.cache/puppeteer. Vercel caches node_modules and
 * the project directory between builds but NOT the home directory, so the
 * browser downloaded during `npm install` is gone by the time
 * `npm run build` executes prerender.js — the build then dies with
 * "Could not find Chrome". Pointing the cache at ./.cache/puppeteer puts it
 * somewhere that survives.
 *
 * Must stay .cjs: package.json sets "type": "module".
 */
module.exports = {
  cacheDirectory: join(__dirname, ".cache", "puppeteer"),
};
