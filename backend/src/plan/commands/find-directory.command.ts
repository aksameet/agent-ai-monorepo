import * as fs from 'fs';
import * as path from 'path';

export function findDirectory(name: string, within: string) {
  const matches: string[] = [];

  function search(dir: string) {
    let entries: fs.Dirent[] = [];
    try {
      entries = fs.readdirSync(dir, { withFileTypes: true });
    } catch (err) {
      return; // Brak uprawnień – pomijamy
    }

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        if (entry.name === name) {
          matches.push(fullPath);
        }
        search(fullPath); // Rekurencyjnie wchodzimy głębiej
      }
    }
  }

  search(within);
  return { matches };
}
