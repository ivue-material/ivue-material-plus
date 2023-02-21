import { isFunction, isPromise } from '@ivue-material-plus/utils';

// 文件上传类型
export type UploaderResultType = 'dataUrl' | 'text' | 'file' | 'url';

// 回调函数
export type Interceptor = (...args: any[]) => Promise<boolean> | boolean;

// 上传最大大小
export type UploaderMaxSize = number | string | ((file: File) => boolean);

// 上传文件列表
export type UploaderFileListItem = {
  url?: string;
  file?: File;
  content?: string;
  status?: '' | 'uploading' | 'done' | 'failed' | 'finished';
  message?: string;
  beforeDelete?: Interceptor;
  previewSize?: string | number;
  deletable?: string;
  imageFit?: 'fill' | 'contain' | 'cover' | 'none' | 'scale-down';
};

// 读取文件内容
export function readFileContent(file: File, resultType: UploaderResultType) {
  return new Promise<string | void>((resolve) => {
    // 文件类型
    if (resultType === 'file') {
      resolve();

      return;
    }

    // url
    if (resultType === 'url') {
      const url = URL.createObjectURL(file);

      resolve(url);

      return;
    }

    const reader = new FileReader();

    reader.onload = (event) => {
      resolve((event.target as FileReader).result as string);
    };

    // base64
    if (resultType === 'dataUrl') {
      reader.readAsDataURL(file);
    }
    // 文本类型
    else if (resultType === 'text') {
      reader.readAsText(file);
    }
  });
}

// 文件是否超出大小
export function isOversize(
  items: UploaderFileListItem | UploaderFileListItem[],
  maxSize: UploaderMaxSize
): boolean {
  return toArray(items).some((item) => {
    if (item.file) {
      if (isFunction(maxSize)) {
        return maxSize(item.file);
      }

      return item.file.size > maxSize;
    }
    return false;
  });
}

// 设置为数组
export function toArray<T>(item: T | T[]): T[] {
  if (Array.isArray(item)) {
    return item;
  }

  return [item];
}

// 过滤文件
export function filterFiles(
  items: UploaderFileListItem[],
  maxSize: UploaderMaxSize
) {
  const valid: UploaderFileListItem[] = [];
  const invalid: UploaderFileListItem[] = [];

  items.forEach((item) => {
    if (isOversize(item, maxSize)) {
      invalid.push(item);
    } else {
      valid.push(item);
    }
  });

  return { valid, invalid };
}

const IMAGE_REGEXP = /\.(jpeg|jpg|gif|png|svg|webp|jfif|bmp|dpg)/i;

export function isImageUrl(url: string): boolean {
  return IMAGE_REGEXP.test(url);
}

// 是图片
export function isImageFile(item: any): boolean {
  // some special urls cannot be recognized
  // user can add `isImage` flag to mark it as an image url

  if (item.isImage) {
    return true;
  }

  // 文件类型
  if (item.file && item.file.type) {
    return item.file.type.indexOf('image') === 0;
  }

  // 有链接
  if (item.url) {
    return isImageUrl(item.url);
  }

  // base64
  if (typeof item.content === 'string') {
    return item.content.indexOf('data:image') === 0;
  }

  return false;
}

// 调用拦截器
export function callInterceptor(options: {
  // 拦截器
  interceptor?: Interceptor;
  // 需要返回的数据
  args?: any[];
  // 事件
  done: () => void;
  canceled?: () => void;
}) {
  const { interceptor, args, done, canceled } = options;

  // 是否有拦截器
  if (interceptor) {
    // eslint-disable-next-line prefer-spread
    const returnVal = interceptor.apply(null, args || []);

    if (isPromise(returnVal)) {
      returnVal
        .then((value) => {
          if (value) {
            done();
          } else if (canceled) {
            canceled();
          }
        })
        .catch(() => {});
    } else if (returnVal) {
      done();
    } else if (canceled) {
      canceled();
    }
  }
  // 没有直接返回事件
  else {
    done();
  }
}
