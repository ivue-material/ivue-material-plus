import process from 'process';
import consola from 'consola';

// 错误提示
export function errorAndExit(err: Error): never {
  consola.error(err);

  process.exit(1);
}
