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

// createPopper
import { createPopper } from '@popperjs/core';

// type
import type { Props, Data } from './types/drop-down';
import { SelectContextKey } from './types/select';

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
    setup(props: Props) {
        // inject
        const select = inject(SelectContextKey);

        // vm
        const { proxy } = getCurrentInstance();

        // 获取Index
        const handleGetIndex = () => {
            transferIncrease();
            return transferIndex;
        };

        // data
        const data = reactive<Data>({
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
            const style: {
                zIndex?: number;
            } = {};

            if (props.transfer) {
                style['z-index'] = 1060 + data.tIndex;
            }

            return style;
        });

        const minWidth = computed(() => {
            return select && `${getStyle(select.selectWrapper, 'width')}`;
        });

        // methods

        // 更新数据
        const update = () => {
            nextTick(() => {
                // 是否已经注册了 popper
                if (data.popper) {
                    data.popper.update();
                    data.popperStatus = true;
                } else {
                    data.popper = createPopper(select.reference, proxy.$el, {
                        // 弹窗的展开方向，
                        placement: props.placement,
                        modifiers: [
                            // 这决定了是否使用 GPU 加速样式来定位 popper
                            {
                                name: 'computeStyles',
                                options: {
                                    gpuAcceleration: false, // true by default
                                },
                            },
                            //检测溢出
                            {
                                name: 'preventOverflow',
                                options: {
                                    rootBoundary: 'viewport',
                                },
                            },
                            {
                                name: 'offset',
                                options: {
                                    offset: [0, 5],
                                },
                            },
                        ],
                        onFirstUpdate: () => {
                            nextTick(() => {
                                data.popper && data.popper.update();
                            });
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
                        data.popper.destroy();
                        data.popper = null;
                    }

                    data.popperStatus = false;
                }, 300);
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

            // methods
            update,
            destroy,
        };
    },
});
</script>
