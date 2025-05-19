import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

@Injectable()
export class PromptLoaderService {
  /**
   * Ładuje prompt z pliku `src/prompts/<name>.prompt.txt` i podmienia zmienne środowiskowe.
   * Rzuca wyjątek, jeśli plik nie istnieje.
   */
  load(name: string): string {
    const filePath = path.join(
      process.cwd(),
      'src',
      'prompts',
      `${name}.prompt.txt`,
    );

    if (!fs.existsSync(filePath)) {
      throw new Error(`[PromptLoader] Prompt file not found: ${filePath}`);
    }

    let content = fs.readFileSync(filePath, 'utf-8');

    content = content
      .replace('${HOME}', os.homedir())
      .replace('${CWD}', process.cwd());

    return content;
  }
}
