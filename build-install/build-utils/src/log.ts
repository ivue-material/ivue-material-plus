const consola = require('consola');
const process = require('process');

// 错误提示
export function errorAndExit(err: Error) {
  consola.error(err);

  process.exit(1);
}
