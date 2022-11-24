<template>
    <teleport to="body" :disabled="!transfer">
        <transition :name="transitionName">
            <div
                v-show="visible"
                :class="wrapperClasses"
                :style="wrapperStyles"
                @mouseenter="handleMouseenter"
                @mouseleave="handleMouseleave"
                @click.stop="handleClick"
                ref="dropDown"
            >
                <slot></slot>
            </div>
        </transition>
    </teleport>
</template>

<script lang='ts'>
import {
    computed,
    reactive,
    nextTick,
    getCurrentInstance,
    onBeforeUnmount,
    ref,
} from 'vue';
import { transferIndex, transferIncrease } from '../../utils/transfer-queue';

import { createPopper } from '@popperjs/core';

const prefixCls = 'ivue-menu-dropdown';

export default {
    name: prefixCls,
    emits: ['on-mouseenter', 'on-mouseleave', 'on-click'],
    props: {
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
         * transitionName
         *
         * @type {String}
         */
        transitionName: {
            type: String,
            default: 'transition-drop',
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
        /**
         * 是否显示
         *
         * @type {Boolean}
         */
        visible: {
            type: Boolean,
        },
        /**
         * 外部样式
         *
         * @type {String}
         */
        styles: {
            type: Object,
            default: () => {},
        },
        /**
         * 外部样式
         *
         * @type {Object}
         */
        classes: {
            type: Object,
            default: () => {},
        },
        /**
         * 外部样式名称
         *
         * @type {String}
         */
        className: {
            type: String,
        },
    },
    setup(props: any, { emit }) {
        // dom
        const dropDown = ref<HTMLDivElement>(null);

        // vm
        const { proxy } = getCurrentInstance();

        // 获取Index
        const handleGetIndex = () => {
            transferIncrease();
            return transferIndex;
        };

        // data
        const data = reactive<{
            width: string;
            zIndex: number;
            popper: any;
            popperStatus: boolean;
        }>({
            /**
             * 宽度
             *
             * @type {string}
             */
            width: '',
            /**
             * 层级
             *
             * @type {Number}
             */
            zIndex: handleGetIndex(),
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

        // 外部样式
        const wrapperClasses = computed(() => {
            return {
                ...props.classes,
                [props.className]: props.className,
                [prefixCls]: true,
            };
        });

        // 外部样式
        const wrapperStyles = computed(() => {
            const style: {
                minWidth?: string;
            } = {
                ...props.styles,
            };

            if (data.width) {
                style.minWidth = `${data.width}px`;
            }

            // 是否将弹层放置于 body 内
            if (props.transfer) {
                style['z-index'] = 1060 + data.zIndex;
            }

            return style;
        });

        // methods

        // 更新数据
        const update = () => {
            // eslint-disable-next-line no-console
            // console.log(' proxy.$parent.$refs.reference',  proxy.$parent.$refs.reference.$el);
            nextTick(() => {
                // 是否已经注册了 popper
                if (data.popper) {
                    data.popper.update();
                    data.popperStatus = true;
                } else {
                    data.popper = createPopper(
                        proxy.$parent.$el,
                        dropDown.value,
                        {
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
                                nextTick(data.popper.update());
                            },
                        }
                    );
                }

                data.zIndex = handleGetIndex();
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

        // 鼠标进入
        const handleMouseenter = (event) => {
            emit('on-mouseenter', event);
        };

        // 鼠标离开
        const handleMouseleave = (event) => {
            emit('on-mouseleave', event);
        };

        // 点击
        const handleClick = (event) => {
            emit('on-click', event);
        };

        // beforeUnmount
        onBeforeUnmount(() => {
            if (data.popper) {
                data.popper.destroy();
                data.popper = null;
            }
        });

        return {
            // dom
            dropDown,

            // data
            data,

            // computed
            wrapperClasses,
            wrapperStyles,

            // methods
            update,
            destroy,
            handleMouseenter,
            handleMouseleave,
            handleClick,
        };
    },
};
</script>
