

import { createLoadingComponent } from './createLoadingComponent';

import type { LoadingOptions, LoadingInstance, LoadingGlobalConfig } from './loading-ts';
import { getStyle, addClass, removeClass } from '../../utils/assist';

import isServer from '../../utils/isServer';


// 默认选项
const defaults: LoadingOptions = {
    parent: null,
    background: '',
    spinner: false,
    text: null,
    fullscreen: true,
    body: false,
    lock: false,
    customClass: '',
};

// 全局加载选项
const globalLoadingOption: LoadingGlobalConfig = {
    fullscreenLoading: null,
};

// 添加样式
const addStyle = (options: LoadingOptions, parent: HTMLElement, instance: LoadingInstance) => {
    const maskStyle: Partial<CSSStyleDeclaration> = {};

    // 开启全屏
    if (options.fullscreen) {
        instance.originalPosition.value = getStyle(document.body, 'position');
        // 隐藏
        instance.originalOverflow.value = getStyle(document.body, 'overflow');
        // zindex
        maskStyle.zIndex = '2001';
    }
    // 渲染 body
    else if (options.body) {
        instance.originalPosition.value = getStyle(document.body, 'position');
    }
    else {
        instance.originalPosition.value = getStyle(parent, 'position');
    }

    Object.keys(maskStyle).forEach(property => {
        instance.$el.style[property] = maskStyle[property];
    });
};

// 添加 class
const addClassList = (options: LoadingOptions, parent: HTMLElement, instance: LoadingInstance) => {

    // 没有定位
    if (instance.originalPosition.value !== 'absolute' && instance.originalPosition.value !== 'fixed') {
        addClass(parent, 'ivue-loading-parent--relative');
    } else {
        removeClass(parent, 'ivue-loading-parent--relative');
    }

    // 全屏 锁定屏幕的滚动 lock
    if (options.fullscreen && options.lock) {
        addClass(parent, 'ivue-loading-parent--hidden');
    } else {
        removeClass(parent, 'ivue-loading-parent--hidden');
    }
};

// loading
const Loading = function (options: LoadingOptions = {}): LoadingInstance {
    if (isServer) return;

    options = {
        ...defaults,
        ...options,
    };


    // Loading 需要覆盖的 DOM 节点。可传入一个 DOM 对象或字符串；若传入字符串，
    // 则会将其作为参数传入 document.querySelector以获取到对应 DOM 节点
    if (typeof options.target === 'string') {
        options.target = document.querySelector(options.target) as HTMLElement;
    }

    options.target = options.target || document.body;

    // 节点元素是否相等
    if (options.target !== document.body) {
    // 开启全屏展示
        options.fullscreen = false;
    } else {
        options.body = true;
    }

    // 全屏 && 全屏加载中
    if (options.fullscreen && globalLoadingOption.fullscreenLoading) {
        globalLoadingOption.fullscreenLoading.close();
    }

    // 获取父级节点
    const parent = options.body ? document.body : options.target;
    options.parent = parent;

    // 创建组件实例
    const instance = createLoadingComponent({
        options,
        globalLoadingOption,
    });

    // 添加样式
    addStyle(options, parent, instance);
    // 添加 class
    addClassList(options, parent, instance);

    // 父级加载样式
    options.parent.LoadingAddClassList = () => {
        addClassList(options, parent, instance);
    };

    // 添加子节点
    parent.appendChild(instance.$el);

    // 开启了全屏
    if (options.fullscreen) {
        globalLoadingOption.fullscreenLoading = instance;
    }

    // 返回实例
    return instance;
};
console.log(Loading());



export default Loading;
