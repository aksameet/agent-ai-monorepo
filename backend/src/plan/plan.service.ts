import { Injectable } from '@nestjs/common';
import { ActionDto } from './dto/action.dto';
import { createFile } from './commands/create-file.command';
import { runCommand } from './commands/run-command.command';
import { listFiles } from './commands/list-files.command';
import { findDirectory } from './commands/find-directory.command';
import { readFile } from './commands/read-file.command';
import { writeFile } from './commands/write-file.command';

@Injectable()
export class PlanService {
  async execute(actions: ActionDto[]) {
    const results = [];

    for (const action of actions) {
      let result;
      switch (action.type) {
        case 'createFile':
          result = createFile(action.args.path, action.args.content);
          break;
        case 'writeFile':
          result = writeFile(action.args.path, action.args.content);
          break;
        case 'readFile':
          result = readFile(action.args.path);
          break;
        case 'runCommand':
          result = await runCommand(action.args.cmd);
          break;
        case 'listFiles':
          result = listFiles(action.args.path);
          break;
        case 'findDirectory':
          result = findDirectory(
            action.args as {
              name: string;
              within: string;
              startsWith?: boolean;
            },
          );
          break;
        default:
          result = { error: `Unknown action type: ${action.type}` };
      }
      results.push({ action: action.type, result });
    }

    return { results };
  }
}
