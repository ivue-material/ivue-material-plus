import {
    createApp,
    createVNode,
    reactive,
    ref,
    toRefs,
    h,
    Transition,
    vShow,
    withCtx,
    withDirectives,
} from 'vue';
import { removeClass } from '../../utils/assist';

// ts
import type { LoadingOptionsResolved } from './types/loading';

export function createLoadingComponent(options: LoadingOptionsResolved) {
    // 离开后的时间
    let afterLeaveTimer: number;

    // 离开的标志
    const afterLeaveFlag = ref(false);

    const data = reactive({
        // 选项
        ...options,
        // 定位
        originalPosition: '',
        // 显示/隐藏
        originalOverflow: '',
        // 是否隐藏
        visible: false,
    });

    // 设置文字
    function setText(text: string) {
        data.text = text;
    }

    // 销毁
    function destroySelf() {
        // 父节点
        const target = data.parent;

        if (!target.LoadingAddClassList) {
            let loadingNumber: number | string | null = target.getAttribute('loading-number');
            loadingNumber = Number.parseInt(loadingNumber as any) - 1;

            // 删除当前loading
            if (!loadingNumber) {
                // 删除相对定位
                removeClass(target, 'ivue-loading-parent--relative');

                target.removeAttribute('loading-number');
            }
            // add loading-number to parent
            else {
                target.setAttribute('loading-number', loadingNumber.toString());
            }

            // 删除隐藏
            removeClass(target, 'ivue-loading-parent--hidden');
        }

        // 删除节点
        removeLoadingChild();

        loadingInstance.unmount();
    }

    // 删除节点
    function removeLoadingChild(): void {
        vm.$el?.parentNode?.removeChild(vm.$el);
    }

    // 关闭
    function close() {
        // 自定义 beforeClose
        if (options.beforeClose && !options.beforeClose()) {
            return;
        }

        // 离开的标志
        afterLeaveFlag.value = true;

        // 延迟销毁关闭 400 ms
        clearTimeout(afterLeaveTimer);

        // 销毁元素
        afterLeaveTimer = window.setTimeout(handleAfterLeave, 400);

        // 关闭
        data.visible = false;

        // close
        options.close?.();
    }

    // 离开方法
    function handleAfterLeave() {
        if (!afterLeaveFlag.value) {
            return;
        }

        afterLeaveFlag.value = false;

        // 清除class
        const target = data.parent;
        target.LoadingAddClassList = undefined;

        // 销毁元素
        destroySelf();
    }

    // 节点元素
    const LoadingComponent = {
        name: 'ivue-loading',
        setup() {
            return () => {
                // 圆形
                const spinner = h('svg', {
                    class: 'circular',
                    viewBox: '25 25 50 50',
                }, [
                    h('circle', { class: 'path', cx: '50', cy: '50', r: '20', fill: 'none' }),
                ]);

                // 图标
                const noSpinner = h('i', { class: data.iconClass }, data.iconText);

                // 需要渲染的文字
                const spinnerText = h('p', { class: 'ivue-loading-text' }, [data.text]);


                // 渲染
                return h(Transition, {
                    name: 'ivue-loading-fade',
                    onAfterLeave: handleAfterLeave,
                }, {
                    default: withCtx(() => [
                        withDirectives(
                            createVNode('div',
                                {
                                    style: {
                                        backgroundColor: data.background || '',
                                    },
                                    class: [
                                        'ivue-loading-mask',
                                        data.customClass,
                                        data.fullscreen ? 'is-fullscreen' : '',
                                    ],
                                }, [
                                h('div', {
                                    class: 'ivue-loading-spinner',
                                }, h('div', {
                                    class: 'ivue-loading-spinner--content',
                                }, [
                                    // 图标渲染函数
                                    data.loadingSpinner ? data.loadingSpinner() : !data.iconClass ? spinner : noSpinner,
                                    data.text ? spinnerText : null,
                                ])),
                            ]),
                            [[vShow, data.visible]])
                    ])
                });
            };
        },
    };

    // 创建节点
    const loadingInstance = createApp(LoadingComponent);
    const vm = loadingInstance.mount(document.createElement('div'));

    return {
        ...toRefs(data),
        setText,
        close,
        removeLoadingChild,
        handleAfterLeave,
        vm,
        get $el(): HTMLElement {
            return vm.$el;
        },
    };
}

export type LoadingInstance = ReturnType<typeof createLoadingComponent>
