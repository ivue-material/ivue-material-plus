import { isRef, ref, } from 'vue';
import { hyphenate, isObject, isString } from '@vue/shared';
import Loading from './loading';

// ts
import { LoadingInstance } from './createLoadingComponent';
import { LoadingOptions } from './types';
import type { Directive, DirectiveBinding, UnwrapRef } from 'vue';

const INSTANCE_KEY = Symbol('IvueLoading');

export type LoadingBinding = boolean | UnwrapRef<LoadingOptions>
export interface ElementLoading extends HTMLElement {
    INSTANCE_KEY: {
        instance: LoadingInstance
        options: LoadingOptions
    }
}

const createInstance = (
    el: ElementLoading,
    binding: DirectiveBinding<LoadingBinding>
) => {
    // 当前实例
    const vm = binding.instance;

    // 获取绑定的props
    const getBindingProp = <K extends keyof LoadingOptions>(
        key: K
    ): LoadingOptions[K] =>
        isObject(binding.value) ? binding.value[key] : undefined;

    const resolveExpression = (key: any) => {
        const data = (isString(key) && vm?.[key]) || key;
        if (data) return ref(data);
        else return data;
    };

    // 获取prop
    const getProp = <K extends keyof LoadingOptions>(name: K) =>
        resolveExpression(
            getBindingProp(name) ||
            el.getAttribute(`ivue-loading-${hyphenate(name)}`)
        );

    // 开启全屏
    const fullscreen =
        getBindingProp('fullscreen') ?? binding.modifiers.fullscreen;

    // 设置参数
    const options: LoadingOptions = {
        // 显示在加载图标下方的加载文案
        text: getProp('text'),
        // 自定义加载图标类名
        iconClass: getProp('iconClass'),
        // 图标 slot
        iconText: getProp('iconText'),
        // 遮罩背景色
        background: getProp('background'),
        // Loading 的自定义类名
        customClass: getProp('customClass'),
        // 开启全屏
        fullscreen,
        // 需要覆盖的 DOM 节点
        target: getBindingProp('target') ?? (fullscreen ? undefined : el),
        // 使遮罩插入至 DOM 中的 body 上
        body: getBindingProp('body') ?? binding.modifiers.body,
        // 锁定屏幕的滚动
        lock: getBindingProp('lock') ?? binding.modifiers.lock,
    };

    // 重置实例
    el[INSTANCE_KEY] = {
        options,
        instance: Loading(options),
    };
};

// 更新选项
const updateOptions = (
    // 新的选项
    newOptions: UnwrapRef<LoadingOptions>,
    // 原始选项
    originalOptions: LoadingOptions
) => {
    for (const key of Object.keys(originalOptions)) {
        // 替换选项是否是 isRef
        if (isRef(originalOptions[key])) {
            originalOptions[key].value = newOptions[key];
        }
    }
};

const vLoading: Directive<ElementLoading, LoadingBinding> = {
    // mounted
    mounted(el, binding) {
        if (binding.value) {
            createInstance(el, binding);
        }
    },
    // 更新
    updated(el, binding) {
        const instance = el[INSTANCE_KEY];

        // 是否需要更新
        if (binding.oldValue !== binding.value) {
            // 初始化实例
            if (binding.value && !binding.oldValue) {
                createInstance(el, binding);
            }
            // 更新选项
            else if (binding.value && binding.oldValue) {
                if (isObject(binding.value)) {
                    updateOptions(binding.value, instance.options);
                }
            }
            // 清除是实例
            else {
                instance?.instance.close();
            }
        }
    },
    // 销毁
    unmounted(el) {
        // 关闭实例
        el[INSTANCE_KEY]?.instance.close();
    },
};

export default vLoading;
