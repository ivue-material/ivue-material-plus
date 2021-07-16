
// 文件上传类型
export type UploaderResultType = 'dataUrl' | 'text' | 'file';

export type Interceptor = (...args: any[]) => Promise<boolean> | boolean;

export type UploaderMaxSize = number | string | ((file: File) => boolean);

export type UploaderFileListItem = {
    url?: string;
    file?: File;
    content?: string;
    status?: '' | 'uploading' | 'done' | 'failed';
    message?: string;
    beforeDelete?: Interceptor;
};

// 读取文件内容
export function readFileContent(file: File, resultType: UploaderResultType) {
    return new Promise<string | void>((resolve) => {
        if (resultType === 'file') {
            resolve();
            return;
        }

        const reader = new FileReader();

        reader.onload = (event) => {
            resolve((event.target as FileReader).result as string);
        };

        if (resultType === 'dataUrl') {
            reader.readAsDataURL(file);
        } else if (resultType === 'text') {
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

// 是否是方法
// eslint-disable-next-line @typescript-eslint/ban-types
export function isFunction(val: unknown): val is Function {
    return typeof val === 'function';
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


// 设置随机字符串
export const getRandomStr = (len = 32) => {
    const $chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';
    const length = $chars.length;

    let str = '';

    for (let i = 0; i < len; i++) {
        str += $chars.charAt(Math.floor(Math.random() * length));
    }

    return str;
};

// 是否有值
export function isDef<T>(val: T): val is NonNullable<T> {
    return val !== undefined && val !== null;
}

const IMAGE_REGEXP = /\.(jpeg|jpg|gif|png|svg|webp|jfif|bmp|dpg)/i;

export function isImageUrl(url: string): boolean {
    return IMAGE_REGEXP.test(url);
}

// 是图片
export function isImageFile(item): boolean {
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
