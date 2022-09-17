import { createVNode, reactive, ref, toRefs, h, Transition, render, VNode, vShow, withCtx, withDirectives } from 'vue';
import { removeClass } from '../../utils/assist';

import type { LoadingCreateComponentParams, LoadingInstance } from './loading-ts';

type Nullable<T> = T | null;

export function createLoadingComponent({ options, globalLoadingOption }: LoadingCreateComponentParams): LoadingInstance {
    // 实例
    let vm: VNode = null;

    // 离开后的时间
    let afterLeaveTimer: Nullable<number> = null;

    // 离开的标志
    const afterLeaveFlag = ref(false);

    const data = reactive({
        // 选项
        ...options,
        originalPosition: '',
        originalOverflow: '',
        // 是否隐藏
        // eslint-disable-next-line no-prototype-builtins
        visible: false
    });

    // 设置文字
    function setText(text: string) {
        data.text = text;
    }

    // 销毁
    function destorySelf() {
        // 父节点
        const target = data.parent;

        // 删除 class
        if (!target.LoadingAddClassList) {
            removeClass(target, 'ivue-loading-parent--relative');
            removeClass(target, 'ivue-loading-parent--hidden');
        }

        // 删除节点
        if (vm.el && vm.el.parentNode) {
            vm.el.parentNode.removeChild(vm.el);
        }
    }

    // 关闭
    function close() {
        // 父节点
        const target = data.parent;
        target.LoadingAddClassList = null;

        // 是否开启了全屏
        if (data.fullscreen) {
            globalLoadingOption.fullscreenLoading = undefined;
        }

        afterLeaveFlag.value = true;
        clearTimeout(afterLeaveTimer);

        // 延迟销毁关闭 400 ms
        afterLeaveTimer = window.setTimeout(() => {
            if (afterLeaveFlag.value) {
                afterLeaveFlag.value = false;
                destorySelf();
            }
        }, 400);

        // 关闭
        data.visible = false;
    }

    // 离开方法
    function handleAfterLeave() {
        if (!afterLeaveFlag.value) {
            return;
        }

        afterLeaveFlag.value = false;

        // 销毁元素
        destorySelf();
    }

    // 组件 setup 参数
    const componetSetupConfig = {
        ...toRefs(data),
        setText,
        close,
        handleAfterLeave,
    };

    // 节点元素
    const LoadingComponent = {
        name: 'ivue-loading',
        setup() {
            return componetSetupConfig;
        },
        render() {
            // 圆形
            const spinner = h('svg', {
                class: 'circular',
                viewBox: '25 25 50 50',
            }, [
                h('circle', { class: 'path', cx: '50', cy: '50', r: '20', fill: 'none' }),
            ]);

            // 图标
            const noSpinner = h('i', { class: this.iconClass }, this.iconText);

            // 需要渲染的文字
            const spinnerText = h('p', { class: 'ivue-loading-text' }, [this.text]);

            // 渲染
            return h(Transition, {
                name: 'ivue-loading-fade',
                onAfterLeave: this.handleAfterLeave,
            }, {
                default: withCtx(() => [
                    withDirectives(createVNode('div', {
                        style: {
                            backgroundColor: this.background || '',
                        },
                        class: [
                            'ivue-loading-mask',
                            this.customClass,
                            this.fullscreen ? 'is-fullscreen' : '',
                        ],
                    },
                        [
                            h('div', {
                                class: 'ivue-loading-spinner',
                            }, [
                                this.iconRender ? this.iconRender() : !this.iconClass ? spinner : noSpinner,
                                this.text ? spinnerText : null,
                            ]),
                        ]),
                        [[vShow, this.visible]])
                ])
            });
        }
    };

    // 创建节点
    vm = createVNode(LoadingComponent);

    render(vm, document.createElement('div'));

    return {
        ...componetSetupConfig,
        vm,
        get $el() {
            return vm.el as HTMLElement;
        },
    };
}
