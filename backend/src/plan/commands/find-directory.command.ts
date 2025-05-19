import * as fs from 'fs';
import * as path from 'path';

export function findDirectory({
  name,
  within,
  startsWith = false,
}: {
  name: string;
  within: string;
  startsWith?: boolean;
}) {
  const matches: string[] = [];

  function walk(dir: string) {
    let entries: fs.Dirent[];
    try {
      entries = fs.readdirSync(dir, { withFileTypes: true });
    } catch (e) {
      return; // skip folders without permission
    }

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        const match =
          startsWith && entry.name.startsWith(name)
            ? true
            : !startsWith && entry.name === name;

        if (match) matches.push(fullPath);
        walk(fullPath);
      }
    }
  }

  walk(within);
  return { matches };
}
