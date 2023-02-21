import { isClient } from '@ivue-material-plus/utils';

// 下载文件
export async function downloadFile(url: string, name = '') {
  if (!isClient) {
    return Promise.reject();
  }

  try {
    const res = await fetch(url);
    const blob = await res.blob();

    const split = res.url.split('/');
    // 文件名称
    const fileName = split[split.length - 1];

    if (!blob) {
      return Promise.reject();
    }

    const localUrl = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('href', localUrl);
    a.setAttribute('download', name || fileName);
    a.click();

    URL.revokeObjectURL(localUrl);

    return Promise.resolve();
  } catch (e) {
    return Promise.reject(e);
  }
}
