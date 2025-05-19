import { Injectable } from '@nestjs/common';
import { ActionDto } from './dto/action.dto';
import { createFile } from './commands/create-file.command';
import { runCommand } from './commands/run-command.command';
import { listFiles } from './commands/list-files.command';
import { findDirectory } from './commands/find-directory.command';
import { readFile } from './commands/read-file.command';

@Injectable()
export class PlanService {
  async execute(actions: ActionDto[]) {
    const results = [];

    for (let i = 0; i < actions.length; i++) {
      const action = actions[i];
      let result;

      switch (action.type) {
        case 'createFile':
          result = createFile(action.args.path, action.args.content);
          break;

        case 'runCommand':
          result = await runCommand(action.args.cmd);
          break;

        case 'listFiles':
          result = listFiles(action.args.path);
          break;

        case 'findDirectory':
          result = findDirectory(action.args.name, action.args.within);
          const matches = result.matches;

          // Jeśli znaleziono wiele folderów – przerywamy z prośbą o doprecyzowanie
          if (Array.isArray(matches) && matches.length > 1) {
            return {
              clarificationRequest:
                `Znaleziono kilka folderów o nazwie "${action.args.name}":\n` +
                matches.map((m, i) => `${i + 1}. ${m}`).join('\n'),
            };
          }

          // Jeśli tylko jeden folder – zamień następne listFiles na właściwą ścieżkę
          const next = actions[i + 1];
          if (matches?.length === 1 && next?.type === 'listFiles') {
            next.args.path = matches[0];
          }

          break;

        case 'readFile':
          result = readFile(action.args.path);
          break;

        default:
          result = { error: `Unknown action type: ${action.type}` };
      }

      results.push({ action: action.type, result });
    }

    return { results };
  }
}
