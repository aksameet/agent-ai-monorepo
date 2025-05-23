import * as fs from 'fs';

export function readFile(path: string) {
  try {
    const content = fs.readFileSync(path, 'utf8');
    return { content };
  } catch (e: any) {
    return { error: e.message };
  }
}
