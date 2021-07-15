
/* eslint-disable */
const SPECIAL_CHARS_REGEXP = /([\:\-\_]+(.))/g;
const MOZ_HACK_REGEXP = /^moz([A-Z])/;

// 转换驼峰class
function camelCase(name: string) {
    return name.replace(SPECIAL_CHARS_REGEXP, (_, separator, letter, offset) => {
        return offset ? letter.toUpperCase() : letter;
    }).replace(MOZ_HACK_REGEXP, 'Moz$1');
}


/* istanbul ignore next */
const trim = function (s: string) {
    return (s || '').replace(/^[\s\uFEFF]+|[\s\uFEFF]+$/g, '')
}


// 判断参数是否是其中之一
export const oneOf = (
    value: string,
    validList: Array<string>
) => {
    for (let i = 0; i < validList.length; i++) {
        if (value === validList[i]) {
            return true;
        }
    }

    return false;
};

// 获取样式
export const getStyle = (element: any, styleName: any): string => {
    if (!element || !styleName) {
        return null;
    }

    styleName = camelCase(styleName);

    if (styleName === 'float') {
        styleName = 'cssFloat';
    }
    try {
        const computed = document.defaultView.getComputedStyle(element, '');

        return element.style[styleName] || computed ? computed[styleName] : null;
    }
    catch (e) {
        return element.style[styleName];
    }
};


// 判断是否有class
/* istanbul ignore next */
export function hasClass(el: HTMLElement, cls: string): boolean {
    if (!el || !cls) return false;
    if (cls.indexOf(' ') !== -1) throw new Error('className should not contain space.');
    if (el.classList) {
        return el.classList.contains(cls);
    } else {
        return (' ' + el.className + ' ').indexOf(' ' + cls + ' ') > -1;
    }
}


// 删除class
/* istanbul ignore next */
export function removeClass(el: HTMLElement, cls: string): void {
    if (!el || !cls) return;
    const classes = cls.split(' ');
    let curClass = ' ' + el.className + ' ';

    for (let i = 0, j = classes.length; i < j; i++) {
        const clsName = classes[i];
        if (!clsName) continue;

        if (el.classList) {
            el.classList.remove(clsName);
        } else {
            if (hasClass(el, clsName)) {
                curClass = curClass.replace(' ' + clsName + ' ', ' ');
            }
        }
    }
    if (!el.classList) {
        el.className = trim(curClass);
    }
}

// 添加 class
/* istanbul ignore next */
export function addClass(el: HTMLElement, cls: string): void {
    if (!el) return
    let curClass = el.className
    const classes = (cls || '').split(' ')

    for (let i = 0, j = classes.length; i < j; i++) {
        const clsName = classes[i]
        if (!clsName) continue

        if (el.classList) {
            el.classList.add(clsName)
        } else if (!hasClass(el, clsName)) {
            curClass += ' ' + clsName
        }
    }
    if (!el.classList) {
        el.className = curClass
    }
}
