import { existsSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const PATCH_MARKER = "// secureuploads-stale-chunk-compat";
const BUILD_VERSION = process.env.SECUREUPLOADS_STALE_ROOT_VERSION ?? "a64d675";
const staleChunkPaths = [
  "/_next/static/chunks/04hz.zrk-iiii.js",
  "/_next/static/chunks/05ifj~dapb_5c.js",
  "/_next/static/chunks/turbopack-0p-dm1ebyhscz.js",
  "/_next/static/chunks/07zrbxdi-buwi.js",
  "/_next/static/chunks/0mboglni45zem.js",
  "/_next/static/chunks/04g17-qo56dr_.js",
  "/_next/static/chunks/0d59yu5hu124l.js",
  "/_next/static/chunks/00bd3pztn~_d8.js",
];

const serverPath = path.join(process.cwd(), ".next", "standalone", "server.js");

if (!existsSync(serverPath)) {
  console.log("[postbuild] standalone server not found, skipping patch");
  process.exit(0);
}

const current = readFileSync(serverPath, "utf8");

if (current.includes(PATCH_MARKER)) {
  console.log("[postbuild] standalone server patch already present");
  process.exit(0);
}

const prelude = `${PATCH_MARKER}
const http = require("http");
const https = require("https");
const staleChunkPaths = new Set(${JSON.stringify(staleChunkPaths)});
const staleRedirectScript = "(()=>{try{const u=new URL(location.href);if(u.searchParams.get('v')!=='${BUILD_VERSION}'){u.searchParams.set('v','${BUILD_VERSION}');location.replace(u.toString());}}catch(e){location.replace(location.pathname+'?v=${BUILD_VERSION}'+location.hash);}})();";

function wrapCreateServer(mod) {
  const original = mod.createServer;

  mod.createServer = function patchedCreateServer(listener) {
    return original.call(this, (req, res) => {
      const pathname = (req.url || "").split("?")[0];

      if (staleChunkPaths.has(pathname)) {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/javascript; charset=utf-8");
        res.setHeader("Cache-Control", "public, max-age=300");

        if (req.method === "HEAD") {
          res.end();
          return;
        }

        res.end(staleRedirectScript);
        return;
      }

      return listener(req, res);
    });
  };
}

wrapCreateServer(http);
wrapCreateServer(https);
`;

writeFileSync(serverPath, `${prelude}\n${current}`);
console.log(`[postbuild] patched ${serverPath}`);
