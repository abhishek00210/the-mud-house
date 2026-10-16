import { build } from "esbuild";
import { mkdir, writeFile, readFile, rm } from "node:fs/promises";
import { resolve } from "node:path";
await mkdir("cms", {recursive:true});
await mkdir(".data", {recursive:true});
const outfile=resolve(".data/seed-bundle.mjs");
await build({entryPoints:["scripts/seed-source.ts"],outfile,bundle:true,platform:"node",format:"esm",jsx:"automatic",packages:"external",alias:{"@":process.cwd()},loader:{".css":"empty"},logLevel:"silent"});
const {seed,imageSlots}=await import(outfile+`?t=${Date.now()}`);
await writeFile("cms/seed.json",JSON.stringify(seed,null,2));
let fields=[];
try { fields=JSON.parse(await readFile("cms/manifest.json","utf8")).contentFields; } catch {}
await writeFile("cms/manifest.json",JSON.stringify({contentFields:fields,imageSlots},null,2));
await rm(outfile);
console.log(`Seed: ${seed.rooms.length} rooms, ${seed.packages.length} packages, ${seed.menu.length} dishes, ${seed.gallery.length} gallery images; ${imageSlots.length} image slots.`);
