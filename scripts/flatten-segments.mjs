// Next 16 static export writes RSC prefetch segments as nested folders
//   out/work/peerprep/__next.work/$d$slug/__PAGE__.txt
// but the client router requests the flattened dotted name
//   out/work/peerprep/__next.work.$d$slug.__PAGE__.txt
// Static hosts can't map one to the other, so we write the dotted copy too.
import { readdir, copyFile, stat } from 'node:fs/promises';
import path from 'node:path';

const OUT = path.resolve('out');
let count = 0;

async function flatten(segDir, prefix, parent) {
  for (const entry of await readdir(segDir, { withFileTypes: true })) {
    const full = path.join(segDir, entry.name);
    const name = `${prefix}.${entry.name}`;
    if (entry.isDirectory()) await flatten(full, name, parent);
    else { await copyFile(full, path.join(parent, name)); count++; }
  }
}

async function walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const full = path.join(dir, entry.name);
    if (entry.name.startsWith('__next.')) await flatten(full, entry.name, dir);
    else if (entry.name !== '_next') await walk(full);
  }
}

await stat(OUT);
await walk(OUT);
console.log(`flatten-segments: wrote ${count} prefetch file(s)`);
