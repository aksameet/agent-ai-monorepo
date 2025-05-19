import * as fs from 'fs';

export function createFile(path: string, content: string) {
  fs.writeFileSync(path, content, 'utf8');
  return { success: true };
}
