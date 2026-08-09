import { readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const ROOT = process.cwd();
const SOURCE_ROOT = path.join(ROOT, "src");
const violations = [];

async function walk(directory) {
  const entries = await readdir(directory);
  const files = [];
  for (const entry of entries) {
    const fullPath = path.join(directory, entry);
    const info = await stat(fullPath);
    if (info.isDirectory()) files.push(...await walk(fullPath));
    else if (entry.endsWith(".js")) files.push(fullPath);
  }
  return files;
}

const files = await walk(SOURCE_ROOT);
for (const file of files) {
  const content = await readFile(file, "utf8");
  const relative = path.relative(ROOT, file);

  for (const match of content.matchAll(/from\s+["'](\.[^"']+)["']/g)) {
    const imported = path.resolve(path.dirname(file), match[1]);
    try {
      await stat(imported);
    } catch {
      violations.push(`${relative}: import inexistente ${match[1]}`);
    }
  }

  if (/\bfetch\s*\(/.test(content)) {
    violations.push(`${relative}: fetch() no autorizado; el producto no debe añadir backend o tracking sin decisión explícita`);
  }

  if (/localStorage\.|sessionStorage\./.test(content)) {
    violations.push(`${relative}: almacenamiento web no documentado; usar únicamente adaptadores de persistencia aprobados`);
  }
}

if (violations.length) {
  console.error("Comprobaciones estructurales fallidas:\n" + violations.map((item) => `- ${item}`).join("\n"));
  process.exit(1);
}

console.log(`Estructura OK: ${files.length} módulos JS, imports relativos válidos y sin fetch/localStorage no autorizados.`);
