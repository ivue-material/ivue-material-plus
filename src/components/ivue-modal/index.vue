<template>
    <teleport to="body" :disabled="!transfer">
        <!-- 蒙版 -->
        <transition :name="transitionNames[1]">
            <div
                :class="`${prefixCls}-mask`"
                :style="wrapperStyles"
                @click="handleMask"
                v-show="data.visible"
                v-if="showMask"
            ></div>
        </transition>
        <!-- 弹窗 -->
        <div :class="wrapperClasses" :style="wrapperStyles" @click="handleWrapperClick">2122</div>
    </teleport>
</template>

<script lang='ts'>
/* eslint-disable */
import {
    computed,
    defineComponent,
    getCurrentInstance,
    onMounted,
    reactive,
    watch,
} from 'vue';

import ScrollbarMixins from './mixins-scrollbar';

import {
    transferIndex as modalIndex,
    transferIncrease as modalIncrease,
} from '../../utils/transfer-queue';

// ts
import type { _ComponentInternalInstance } from './types';

const prefixCls = 'ivue-modal';

export default defineComponent({
    name: prefixCls,
    mixins: [ScrollbarMixins],
    emits: ['update:modelValue', 'on-cancel'],
    props: {
        /**
         * modelValue
         *
         * @type {Boolean}
         */
        modelValue: {
            type: Boolean,
            default: false,
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
         * 自定义显示动画，第一项是模态框，第二项是背景
         *
         * @type {Array}
         */
        transitionNames: {
            type: Array,
            default() {
                return ['zoom', 'fade'];
            },
        },
        /**
         * 弹窗层级
         *
         * @type {Number}
         */
        zIndex: {
            type: Number,
            default: 1000,
        },
        /**
         * 是否显示遮罩层
         *
         * @type {Boolean}
         */
        mask: {
            type: Boolean,
            default: true,
        },
        /**
         * 是否允许点击遮罩层关闭
         *
         * @type {Boolean}
         */
        maskClosable: {
            type: Boolean,
            default() {
                const global =
                    getCurrentInstance().appContext.config.globalProperties;

                return !global.$IVUE || global.$IVUE.modal.maskClosable === ''
                    ? true
                    : global.$IVUE.modal.maskClosable;
            },
        },
        /**
         * 返回 Promise 可以阻止关闭
         *
         * @type {Function}
         */
        beforeClose: {
            type: Function,
        },
        /**
         * 自定义对话框 class
         *
         * @type {String}
         */
        className: {
            type: String,
        },
    },
    setup(props: any, { emit }) {
        // proxy
        const { proxy } = getCurrentInstance() as _ComponentInternalInstance;

        // computed

        // 外层样式
        const wrapperClasses = computed(() => {
            return [
                `${prefixCls}-wrapper`,
                {
                    // 隐藏
                    [`${prefixCls}-hidden`]: !data.wrapperShow,
                    // 没有蒙版
                    [`${prefixCls}-no-mask`]: !showMask.value,
                    [`${props.className}`]: !!props.className,
                },
            ];
        });

        // 外层样式
        const wrapperStyles = computed(() => {
            return {
                zIndex: data.modalIndex + props.zIndex,
            };
        });

        // 是否显示蒙版
        const showMask = computed(() => {
            return props.mask;
        });

        // methods

        // 获取弹窗zIndex
        const handleGetModalIndex = (): number => {
            modalIncrease();

            return modalIndex;
        };

        // 点击蒙版
        const handleMask = () => {
            if (props.maskClosable && showMask.value) {
                close();
            }
        };

        // 关闭方法
        const handleClose = () => {
            data.visible = false;

            // modelValue
            emit('update:modelValue', false);

            // 点击取消的回调
            emit('on-cancel');
        };

        // 关闭
        const close = () => {
            // 没有自定义关闭方法
            if (!props.beforeClose) {
                return handleClose();
            }

            // 自定义关闭方法
            const before = props.beforeClose();

            // Promise
            if (before && before.then) {
                before.then(() => {
                    handleClose();
                });
            }
            // 不是Promise
            else {
                handleClose();
            }
        };

        // 弹窗外层点击
        const handleWrapperClick = (event) => {
            if (data.isMouseTriggerIn) {
                data.isMouseTriggerIn = false;

                return;
            }

            // 匹配当前点击的是不是弹窗 还是弹窗外面
            const className = event.target.getAttribute('class');

            // 点击弹窗外面
            if (className && className.indexOf(`${prefixCls}-wrapper`) > -1) {
                handleMask();
            }
        };

        // data
        const data = reactive<{
            visible: boolean;
            modalIndex: number;
            wrapperShow: boolean;
            isMouseTriggerIn: boolean;
            timer: ReturnType<typeof setTimeout> | null;
        }>({
            /**
             * 显示/隐藏
             *
             * @type {Boolean}
             */
            visible: props.modelValue,
            /**
             * 弹窗zIndex
             *
             * @type {Number}
             */
            modalIndex: handleGetModalIndex(),
            /**
             * 外层显示
             *
             * @type {Boolean}
             */
            wrapperShow: false,
            /**
             * 鼠标点击
             *
             * @type {Boolean}
             */
            isMouseTriggerIn: false,
            /**
             * setTimeout
             *
             * @type  {Function}
             */
            timer: null,
        });

        // watch

        // 监听modelValue
        watch(
            () => props.modelValue,
            (value) => {
                data.visible = value;
            }
        );

        // 监听显示/隐藏
        watch(
            () => data.visible,
            (value) => {
                if (value === false) {
                    // 300s 等待蒙层动画结束紧跟弹窗动画
                    data.timer = setTimeout(() => {
                        // 隐藏外层显示
                        data.wrapperShow = false;

                        // 删除滚动条修改
                        proxy.removeScrollEffect();
                    }, 300);
                } else {
                    // if (this.lastVisible !== val) {
                    //     this.modalIndex = this.handleGetModalIndex();
                    //     lastVisibleIncrease();
                    // }
                    // if (this.timer) clearTimeout(this.timer);
                    // this.wrapShow = true;
                    // if (!this.scrollable) {
                    //     this.addScrollEffect();
                    // }
                }
            }
        );

        // onMounted
        onMounted(() => {
            // 显示
            if (data.visible) {
                // 外层显示
                data.wrapperShow = true;
            }
        });

        return {
            prefixCls,

            // data
            data,

            // computed
            wrapperClasses,
            wrapperStyles,
            showMask,

            // methods
            handleMask,
            handleWrapperClick,
        };
    },
});
</script>
