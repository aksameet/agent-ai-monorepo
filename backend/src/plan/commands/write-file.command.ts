import * as fs from 'fs';

export function writeFile(path: string, content: string) {
  try {
    fs.writeFileSync(path, content, 'utf8');
    return { success: true };
  } catch (e: any) {
    return { error: e.message };
  }
}
