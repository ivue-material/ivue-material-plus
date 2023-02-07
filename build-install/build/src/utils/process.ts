import { spawn } from 'child_process';
import chalk from 'chalk';
import consola from 'consola';

import { projRoot } from '../../../build-utils/src';

// 运行 chalk
export const run = async (command: string, cwd = projRoot) => {
  return new Promise<void>((resolve, reject) => {
    const [cmd, ...args] = command.split(' ');

    // 开始运行提示
    consola.info(`run: ${chalk.green(`${cmd} ${args.join(' ')}`)}`);

    // node 执行的命令
    const app = spawn(cmd, args, {
      cwd,
      stdio: 'inherit',
      shell: process.platform === 'win32',
    });

    // 在进程退出
    const onProcessExit = () => app.kill('SIGHUP');

    // 在进程退出
    app.on('close', (code) => {
      process.removeListener('exit', onProcessExit);

      // 成功
      if (code === 0) {
        resolve();
      }
      // 错误信息
      else {
        reject(
          new Error(`Command failed. \n Command: ${command} \n Code: ${code}`)
        );
      }
    });

    // 退出
    process.on('exit', onProcessExit);
  });
};
