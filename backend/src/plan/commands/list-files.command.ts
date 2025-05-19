import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

/**
 * Rozwiązuje ~ i ścieżki względne, zwraca listę plików lub błąd
 */
export function listFiles(inputPath: string) {
  try {
    const expandedPath = inputPath.startsWith('~')
      ? path.join(os.homedir(), inputPath.slice(1))
      : inputPath;

    const resolved = path.resolve(expandedPath);
    const stat = fs.statSync(resolved);
    if (!stat.isDirectory()) throw new Error('Not a directory');

    const files = fs.readdirSync(resolved);
    return { files };
  } catch (e: any) {
    return { error: e.message };
  }
}
