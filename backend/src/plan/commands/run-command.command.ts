import { exec } from 'child_process';

export function runCommand(cmd: string): Promise<any> {
  return new Promise((resolve) => {
    exec(cmd, (err, stdout, stderr) => {
      if (err) {
        resolve({ error: stderr });
      } else {
        resolve({ output: stdout });
      }
    });
  });
}
