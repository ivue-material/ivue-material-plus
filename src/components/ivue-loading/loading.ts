
import { nextTick } from 'vue';
import { isString } from '@vue/shared';

import { getStyle, addClass, removeClass } from '../../utils/assist';
import { createLoadingComponent, LoadingInstance } from './createLoadingComponent';
import { useZIndex } from '../../utils/helpers';
import isServer from '../../utils/isServer';

// ts
import type { CSSProperties } from 'vue';
import type { LoadingOptions, LoadingOptionsResolved } from './types/loading';

// 全屏展示实例
let fullscreenInstance: LoadingInstance | undefined = undefined;

// 添加样式
const addStyle = async (
    options: LoadingOptionsResolved,
    parent: HTMLElement,
    instance: LoadingInstance
) => {
    const { nextZIndex } = useZIndex();

    // css
    const maskStyle: CSSProperties = {};

    // 开启全屏
    if (options.fullscreen) {
        // 定位
        instance.originalPosition.value = getStyle(document.body, 'position');
        // 隐藏
        instance.originalOverflow.value = getStyle(document.body, 'overflow');
        // zIndex
        maskStyle.zIndex = nextZIndex();
    }
    // 渲染 body
    else if (options.parent === document.body) {
        instance.originalPosition.value = getStyle(document.body, 'position');

        /**
         * await dom render when visible is true in init,
         * because some component's height maybe 0.
         * e.g. table.
         */
        await nextTick();

        // 偏移位置
        for (const property of ['top', 'left']) {
            const scroll = property === 'top' ? 'scrollTop' : 'scrollLeft';

            const position =
                // 元素相对于视窗 top/left
                (options.target as HTMLElement).getBoundingClientRect()[property] +
                // 滚动条位置 scrollTop/scrollLeft
                document.body[scroll] +
                // 滚动条位置 scrollTop/scrollLeft
                document.documentElement[scroll] -
                // body margin
                Number.parseInt(getStyle(document.body, `margin-${property}`), 10);

            // 偏移位置
            maskStyle[property] = `${position}px`;
        }

        // 设置高度
        for (const property of ['height', 'width']) {
            // 元素高度/width
            maskStyle[property] = `${(options.target as HTMLElement).getBoundingClientRect()[property]}px`;
        }

    }
    // 设置定位
    else {
        instance.originalPosition.value = getStyle(parent, 'position');
    }

    // 设置样式
    for (const [key, value] of Object.entries(maskStyle)) {
        instance.$el.style[key] = value;
    }

};

// 添加 class
const addClassList = (
    options: LoadingOptionsResolved,
    parent: HTMLElement,
    instance: LoadingInstance
) => {

    // 没有定位
    if (instance.originalPosition.value !== 'absolute' &&
        instance.originalPosition.value !== 'fixed') {
        addClass(parent, 'ivue-loading-parent--relative');
    }
    // 删除相对定位
    else {
        removeClass(parent, 'ivue-loading-parent--relative');
    }

    // 全屏 锁定屏幕的滚动 lock
    if (options.fullscreen && options.lock) {
        addClass(parent, 'ivue-loading-parent--hidden');
    }
    // 删除隐藏
    else {
        removeClass(parent, 'ivue-loading-parent--hidden');
    }
};

// 获取选项
const resolveOptions = (options: LoadingOptions): LoadingOptionsResolved => {
    let target: HTMLElement;

    // 获取 document.body
    if (isString(options.target)) {
        target =
            document.querySelector<HTMLElement>(options.target) ?? document.body;
    }
    // 获取 options.target || document.body
    else {
        target = options.target || document.body;
    }

    return {
        parent: target === document.body || options.body ? document.body : target,
        // 遮罩背景色
        background: options.background || '',
        // 显示在加载图标下方的加载文案
        text: options.text || '',
        // 全屏遮罩
        fullscreen: target === document.body && (options.fullscreen ?? true),
        // 锁定屏幕的滚动
        lock: options.lock ?? false,
        // Loading 的自定义类名
        customClass: options.customClass || '',
        // 显示/隐藏
        visible: options.visible ?? true,
        // 自定义加载图标类名
        iconClass: options.iconClass,
        // 自定义加载图标内容
        iconText: options.iconText,
        // 获取当前 target
        target,
        // 自定义旋转图标
        loadingSpinner: options.loadingSpinner
    };
};

// loading
const Loading = function (options: LoadingOptions = {}): LoadingInstance {
    if (isServer) {
        return undefined;
    }

    // 获取选项
    const resolved = resolveOptions(options);

    // 有全屏
    if (resolved.fullscreen && fullscreenInstance) {
        return fullscreenInstance;
    }

    // 创建组件实例
    const instance = createLoadingComponent({
        ...resolved,
        close: () => {
            // 外部掉用的关闭
            resolved.close?.();

            // 销毁全屏实例
            if (resolved.fullscreen) {
                fullscreenInstance = undefined;
            }
        }
    });

    // 添加样式
    addStyle(resolved, resolved.parent, instance);
    // 添加 class
    addClassList(resolved, resolved.parent, instance);

    // 父级加载样式
    resolved.parent.LoadingAddClassList = () => addClassList(resolved, resolved.parent, instance);

    /**
     * add loading-number to parent.
     * because if a fullscreen loading is triggered when somewhere
     * a v-loading.body was triggered before and it's parent is
     * document.body which with a margin , the fullscreen loading's
     * destroySelf function will remove 'ivue-loading-parent--relative',
     * and then the position of v-loading.body will be error.
     */
    let loadingNumber: string = resolved.parent.getAttribute('loading-number');

    if (!loadingNumber) {
        loadingNumber = '1';
    } else {
        loadingNumber = `${Number.parseInt(loadingNumber) + 1}`;
    }

    resolved.parent.setAttribute('loading-number', loadingNumber);

    // 添加子节点
    resolved.parent.appendChild(instance.$el);

    // 在实例渲染之后，然后修改可见以触发过渡
    nextTick(() => (instance.visible.value = resolved.visible));

    // 开启了全屏
    if (resolved.fullscreen) {
        fullscreenInstance = instance;
    }

    // 返回实例
    return instance;
};


export default Loading;
