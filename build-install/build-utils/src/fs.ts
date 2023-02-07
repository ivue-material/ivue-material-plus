import { existsSync } from 'fs';
import { mkdir, writeFile } from 'fs/promises';

// 读取 json 文件
export const writeJson = (path: string, data: any, spaces = 0) => {
  writeFile(path, JSON.stringify(data, undefined, spaces), 'utf-8');
};

// 是否有目录
export const ensureDir = async (path: string) => {
  if (!existsSync(path)) {
    await mkdir(path, { recursive: true });
  }
};
