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

import Popper from 'popper.js/dist/umd/popper.js';

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
            let style: {
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
            nextTick(() => {
                // 是否已经注册了 popper
                if (data.popper) {
                    data.popper.update();
                    data.popperStatus = true;
                } else {
                    data.popper = new Popper(
                        proxy.$parent.$refs.reference,
                        dropDown.value,
                        {
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
