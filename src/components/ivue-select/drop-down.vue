<template>
    <div
        class="ivue-select-dropdown"
        :class="className"
        :style="{
            minWidth,
            ...styles
         }"
    >
        <slot></slot>
    </div>
</template>

<script lang='ts'>
import {
    defineComponent,
    computed,
    reactive,
    onMounted,
    inject,
    nextTick,
    getCurrentInstance,
    onBeforeUnmount,
} from 'vue';
import { getStyle } from '../../utils/assist';
import { transferIndex, transferIncrease } from '../../utils/transfer-queue';

import Popper from 'popper.js/dist/umd/popper.js';

const prefixCls = 'ivue-select-dropdown';

export default defineComponent({
    name: prefixCls,
    props: {
        /**
         * 外层样式
         *
         * @type {String}
         */
        className: {
            type: String,
        },
        /**
         * 是否将弹层放置于 body 内，在 Tabs、
         * 带有 fixed 的 Table 列内使用时，
         * 建议添加此属性，它将不受父级样式影响，
         * 从而达到更好的效果
         *
         * @type {Boolean}
         */
        transfer: {
            type: Boolean,
            default() {
                const global =
                    getCurrentInstance().appContext.config.globalProperties;

                return !global.$IVUE || global.$IVUE.transfer === ''
                    ? false
                    : global.$IVUE.transfer;
            },
        },
        /**
         * 是否开启 Popper 的 eventsEnabled 属性，开启可能会牺牲一定的性能
         *
         * @type {Boolean}
         */
        eventsEnabled: {
            type: Boolean,
            default: false,
        },
        /**
         * 弹窗的展开方向，
         * 可选值为 top、bottom、top-start、bottom-start、top-end、bottom-end
         *
         * @type {String}
         */
        placement: {
            type: String,
            default: 'bottom-start',
        },
    },
    setup(props: any) {
        // inject
        const select: any = inject('ivue-select');

        // vm
        const { proxy } = getCurrentInstance();

        // 获取Index
        const handleGetIndex = () => {
            transferIncrease();
            return transferIndex;
        };

        // data
        const data: any = reactive<{
            width: string;
            tIndex: number;
            popper: any;
            popperStatus: boolean;
        }>({
            /**
             * 是否显示菜单
             *
             * @type {String}
             */
            width: '',
            /**
             * index
             *
             * @type {Number}
             */
            tIndex: handleGetIndex(),
            /**
             * popper
             *
             * @type {Function}
             */
            popper: null,
            /**
             * popper状态
             *
             * @type {Boolean}
             */
            popperStatus: false,
        });

        // computed
        const styles = computed(() => {
            let style: any = {};

            if (props.transfer) {
                style['z-index'] = 1060 + data.tIndex;
            }

            return style;
        });

        const minWidth = computed(
            () => select && `${getStyle(select.selectWrapper, 'width')}`
        );

        // methdos

        // 更新数据
        const update = () => {
            nextTick(() => {
                // 是否已经注册了 popper
                if (data.popper) {
                    data.popper.update();
                    data.popperStatus = true;
                } else {
                    data.popper = new Popper(select.reference, proxy.$el, {
                        // eventsEnabled
                        eventsEnabled: props.eventsEnabled,
                        // 弹窗的展开方向，
                        placement: props.placement,
                        modifiers: {
                            computeStyle: {
                                // 如果为 true，它使用 CSS 3D 转换来定位 popper
                                gpuAcceleration: false,
                            },
                            preventOverflow: {
                                boundariesElement: 'window',
                            },
                        },
                        onCreate: () => {
                            resetTransformOrigin();

                            nextTick(data.popper.update());
                        },
                        onUpdate: () => {
                            resetTransformOrigin();
                        },
                    });
                }

                data.tIndex = handleGetIndex();
            });
        };

        // 销毁
        const destroy = () => {
            if (data.popper) {
                setTimeout(() => {
                    if (data.popper && !data.popperStatus) {
                        data.popper.popper.style.display = 'none';
                        data.popper.destroy();
                        data.popper = null;
                    }

                    data.popperStatus = false;
                }, 300);
            }
        };

        // 重置动画位置
        const resetTransformOrigin = () => {
            if (!data.popper) {
                return;
            }

            let x_placement = data.popper.popper.getAttribute('x-placement');
            let placementStart = x_placement.split('-')[0];
            let placementEnd = x_placement.split('-')[1];
            const leftOrRight =
                x_placement === 'left' || x_placement === 'right';

            if (!leftOrRight) {
                data.popper.popper.style.transformOrigin =
                    placementStart === 'bottom' ||
                    (placementStart !== 'top' && placementEnd === 'start')
                        ? 'center top'
                        : 'center bottom';
            }
        };

        // onMounted
        onMounted(() => {
            update();
        });

        // beforeUnmount
        onBeforeUnmount(() => {
            if (data.popper) {
                data.popper.destroy();
                data.popper = null;
            }
        });

        return {
            // data
            data,

            // computed
            styles,
            minWidth,

            // methdos
            update,
            destroy,
        };
    },
});
</script>
