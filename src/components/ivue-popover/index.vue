<template>
    <div
        :class="wrapperClasses"
        @mouseenter="handleMouseenter"
        @mouseleave="handleMouseleave"
        v-click-outside:[capture]="handleClickOutside"
    >
        <!-- 描述 -->
        <div
            :class="`${prefixCls}-rel`"
            ref="reference"
            @click="handleRelClick"
            @mousedown="handleFocus(false)"
            @mouseup="handleBlur(false)"
        >
            <slot></slot>
        </div>
        <!-- 为封装到组件中来构建 UI -->
        <teleport to="body" :disabled="!transfer">
            <transition name="fade">
                <div
                    :class="popperClasses"
                    :style="popperStyles"
                    @click="handleTransferClick"
                    @mouseenter="handleMouseenter('popper')"
                    @mouseleave="handleMouseleave"
                    ref="popper"
                    v-show="visible"
                >
                    <div :class="`${prefixCls}-content`">
                        <!-- arrow -->
                        <div :class="`${prefixCls}-arrow`" ref="arrow"></div>
                        <!-- 对话框 -->
                        <div :class="`${prefixCls}-inner`" v-if="confirm">
                            <!-- body -->
                            <div :class="`${prefixCls}-body`">
                                <!-- icon -->
                                <ivue-icon :class="`${prefixCls}-body--icon`">help</ivue-icon>
                                <!-- title -->
                                <div :class="`${prefixCls}-body--message`">
                                    <slot name="title">{{ title }}</slot>
                                </div>
                            </div>
                            <!-- 底部 -->
                            <div :class="`${prefixCls}-footer`">
                                <ivue-button
                                    :class="`${prefixCls}-footer--button`"
                                    outline
                                    color="#dcdfe6"
                                    @click="handleCancel"
                                >{{ cancelText }}</ivue-button>
                                <!-- 确认 -->
                                <ivue-button
                                    :class="`${prefixCls}-footer--button`"
                                    depressed
                                    status="primary"
                                    @click="handleConfirm"
                                >{{ confirmText }}</ivue-button>
                            </div>
                        </div>
                        <!-- 不是对话框 -->
                        <div :class="`${prefixCls}-inner`" v-if="!confirm">
                            <!-- title -->
                            <div :class="`${prefixCls}-title`" v-if="showTitle">
                                <slot name="title">{{ title }}</slot>
                            </div>
                            <!-- body -->
                            <div :class="`${prefixCls}-body`">
                                <div :class="bodyContentClasses">
                                    <slot name="content">{{ content }}</slot>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </transition>
        </teleport>
    </div>
</template>

<script lang="ts">
import {
    defineComponent,
    computed,
    reactive,
    ref,
    getCurrentInstance,
    onMounted,
    nextTick,
} from 'vue';
import { useEventListener } from '@vueuse/core';

// utils
import { oneOf } from '../../utils/assist';
import Popper from '../../utils/mixins/popper';
import { transferIndex, transferIncrease } from '../../utils/transfer-queue';

// ts
import { _ComponentInternalInstance } from './types';

// 注册外部点击事件插件
import { ClickOutside } from '../../utils/directives';

// components
import IvueIcon from '../ivue-icon';
import IvueButton from '../ivue-button';

const prefixCls = 'ivue-popover';

export default defineComponent({
    name: prefixCls,
    mixins: [Popper],
    emits: ['on-cancel', 'on-confirm'],
    // 注册局部指令
    directives: { ClickOutside },
    props: {
        /**
         * 显示的标题
         *
         * @type {String, Number}
         */
        title: {
            type: [String, Number],
        },
        /**
         * 提示框的内容
         *
         * @type {String, Number}
         */
        content: {
            type: [String, Number],
            default: '',
        },
        /**
         * 触发方式，
         * 可选值为hover（悬停）click（点击）focus（聚焦）,
         * 在 confirm 模式下，只有 click 有效
         *
         * @type {String}
         */
        trigger: {
            validator(value: string) {
                return oneOf(value, ['click', 'focus', 'hover']);
            },
            default: 'click',
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
         * 开启 transfer 时，给浮层添加额外的 class 名称
         *
         * @type {String}
         */
        transferClassName: {
            type: String,
        },
        /**
         * 主题，可选值为 dark 或 light
         *
         * @type {String}
         */
        theme: {
            type: String,
            validator(value: string) {
                return oneOf(value, ['dark', 'light']);
            },
            default: 'light',
        },
        /**
         * 宽度，最小宽度为 150px，在 confirm 模式下，默认最大宽度为 300px
         *
         * @type {String | Number}
         */
        width: {
            type: [String, Number],
        },
        /**
         * 开启后，超出指定宽度文本将自动换行，并两端对齐
         *
         * @type {Boolean}
         */
        wordWrap: {
            type: Boolean,
            default: false,
        },
        /**
         * 是否开启对话框模式
         *
         * @type {Boolean}
         */
        confirm: {
            type: Boolean,
            default: false,
        },
        /**
         * 是否禁用
         *
         * @type {Boolean}
         */
        disabled: {
            type: Boolean,
            default: false,
        },
        /**
         * 延迟显示，单位毫秒
         *
         * @type {Number}
         */
        delay: {
            type: Number,
            default: 100,
        },
        /**
         * 弹窗的展开方向
         *
         * @type {String}
         */
        placement: {
            validator(value: string) {
                return oneOf(value, [
                    'top',
                    'top-start',
                    'top-end',
                    'bottom',
                    'bottom-start',
                    'bottom-end',
                    'left',
                    'left-start',
                    'left-end',
                    'right',
                    'right-start',
                    'right-end',
                ]);
            },
            default: 'bottom',
        },
        /**
         * 是否开启外部点击的 capture 模式，可通过全局配置
         *
         * @type {Boolean}
         */
        capture: {
            type: Boolean,
            default() {
                const global =
                    getCurrentInstance().appContext.config.globalProperties;
                return !global.$IVUE ? true : global.$IVUE.capture;
            },
        },
        /**
         * 关闭文案
         *
         * @type {String}
         */
        cancelText: {
            type: String,
            default: 'Cancel',
        },
        /**
         * 确定按钮文字
         *
         * @type {String}
         */
        confirmText: {
            type: String,
            default: 'Confirm',
        },
    },
    setup(props: any, { emit, slots }) {
        // dom
        const popper = ref(null);
        const reference = ref(null);

        // data

        // 显示隐藏
        const visible = ref(props.modelValue);

        const data = reactive<{
            timeout: ReturnType<typeof setTimeout> | null;
            zIndex: number;
            disableCloseUnderTransfer: boolean;
            isInput: boolean;
            currentTargetFocus: boolean;
        }>({
            /**
             * 延迟
             *
             * @type {Function}
             */
            timeout: null,
            /**
             * 当前元素index
             *
             * @type {Number}
             */
            zIndex: 0,
            /**
             * transfer 模式下，点击 slot 也会触发关闭
             *
             * @type {Boolean}
             */
            disableCloseUnderTransfer: false,
            /**
             * 是否有input
             *
             * @type {Boolean}
             */
            isInput: false,
            /**
             * 当前点击target获取焦点
             *
             * @type {Event}
             */
            currentTargetFocus: false,
        });

        // computed

        // 外部样式
        const wrapperClasses = computed(() => {
            return [
                prefixCls,
                {
                    [`${prefixCls}-confirm`]: props.confirm,
                },
            ];
        });

        // 悬浮框样式
        const popperClasses = computed(() => {
            return [
                `${prefixCls}-popper`,
                {
                    // 主题
                    [`${prefixCls}-${props.theme}`]: true,
                    // 是否将弹层放置于 body 内
                    [`${prefixCls}-transfer`]: props.transfer,
                    // 开启 transfer 时，给浮层添加额外的 class 名称
                    [props.transferClassName]: props.transferClassName,
                },
            ];
        });

        // 悬浮框样式
        const popperStyles = computed(() => {
            let styles: {
                width?: string | number;
                zIndex?: number;
            } = {};

            // 设置宽度
            if (props.width) {
                styles.width = `${props.width}px`;
            }

            // 是否将弹层放置于 body 内
            if (props.transfer) {
                styles['z-index'] = 1060 + data.zIndex;
            }

            return styles;
        });

        // body
        const bodyContentClasses = computed(() => {
            return [
                `${prefixCls}-body--content`,
                {
                    [`${prefixCls}-body--word-wrap`]: props.wordWrap,
                },
            ];
        });

        // 显示标题
        const showTitle = computed(() => {
            // 不是对话框模式
            if (!props.confirm) {
                return slots.title !== undefined || props.title;
            }

            return false;
        });

        // methods

        // 获取index
        const handleGetIndex = () => {
            transferIncrease();

            return transferIndex;
        };

        // 增加zIndex
        const handleIndexIncrease = () => {
            data.zIndex = handleGetIndex();
        };

        // 鼠标进入
        const handleMouseenter = (status?: string) => {
            // 是否禁用
            if (props.disabled) {
                return;
            }

            // 进入到弹框 && 获取焦点
            if (status === 'popper' && data.currentTargetFocus) {
                // 清除延迟
                clearTimeout(data.timeout);
            }

            // 不是 hover || 开启了对话框
            if (props.trigger !== 'hover' || props.confirm) {
                return false;
            }

            // 清除延迟
            if (data.timeout) {
                clearTimeout(data.timeout);
            }

            // 延迟时间
            data.timeout = setTimeout(() => {
                visible.value = true;
            }, props.delay);
        };

        // 鼠标离开
        const handleMouseleave = () => {
            // 获取焦点 鼠标移出元素 关闭弹框
            if (data.currentTargetFocus) {
                clearTimeout(data.timeout);

                data.timeout = setTimeout(() => {
                    visible.value = false;
                }, 100);
            }

            // 不是 hover || 开启了对话框
            if (props.trigger !== 'hover' || props.confirm) {
                return false;
            }

            // 清除延迟
            if (data.timeout) {
                clearTimeout(data.timeout);

                data.timeout = setTimeout(() => {
                    visible.value = false;
                }, 100);
            }
        };

        // 描述点击
        const handleRelClick = () => {
            // 是否禁用
            if (props.disabled) {
                return;
            }

            // 开启了对话框
            if (props.confirm) {
                visible.value = !visible.value;

                return;
            }

            // 不是点击事件
            if (props.trigger !== 'click') {
                return false;
            }

            visible.value = !visible.value;
        };

        // 点击外部
        const handleClickOutside = () => {
            // 点击的是内容
            if (data.disableCloseUnderTransfer) {
                data.disableCloseUnderTransfer = false;

                return false;
            }

            // 开启了对话框
            if (props.confirm) {
                visible.value = false;

                return;
            }

            // 不是点击事件
            if (props.trigger !== 'click') {
                return false;
            }

            visible.value = false;
        };

        // transfer时点击
        const handleTransferClick = () => {
            if (props.transfer) {
                data.disableCloseUnderTransfer = true;
            }
        };

        // 获取焦点
        const handleFocus = (fromInput = true) => {
            // 是否禁用
            if (props.disabled) {
                return;
            }

            // 触发方式 不是 focus || 开启对话框 || 没有input
            if (
                props.trigger !== 'focus' ||
                props.confirm ||
                (data.isInput && !fromInput)
            ) {
                return false;
            }

            // 没有输入框
            if (!data.isInput) {
                // 当前获取焦点
                data.currentTargetFocus = true;
            }

            // 显示
            visible.value = true;
        };

        // 失去焦点
        const handleBlur = (fromInput = true) => {
            // 触发方式 不是 focus || 开启对话框 || 没有input
            if (
                props.trigger !== 'focus' ||
                props.confirm ||
                (data.isInput && !fromInput)
            ) {
                return false;
            }

            // 没有输入框
            if (!data.isInput) {
                data.currentTargetFocus = false;
            }

            // 显示
            visible.value = false;
        };

        // 获取是否有input
        const getInputChildren = () => {
            const input = reference.value.querySelectorAll('input');
            const textarea = reference.value.querySelectorAll('textarea');

            let children = null;

            // input
            if (input.length) {
                children = input[0];
            }
            // textarea
            else if (textarea.length) {
                children = textarea[0];
            }

            return children;
        };

        // 取消
        const handleCancel = () => {
            visible.value = false;

            emit('on-cancel');
        };

        // 确认
        const handleConfirm = () => {
            visible.value = false;

            emit('on-confirm');
        };

        // onMounted
        onMounted(() => {
            data.zIndex = handleGetIndex();

            // if trigger and children is input or textarea,
            // listen focus & blur event
            if (props.trigger === 'focus') {
                nextTick(() => {
                    const children = getInputChildren();

                    // 有input
                    if (children) {
                        data.isInput = true;

                        useEventListener(children, 'focus', handleFocus, false);
                        useEventListener(children, 'blur', handleBlur, false);
                    }
                });
            }
        });

        return {
            prefixCls,
            // dom
            reference,
            popper,

            // data
            data,
            visible,

            // computed
            wrapperClasses,
            popperClasses,
            popperStyles,
            bodyContentClasses,
            showTitle,

            // methods
            handleIndexIncrease,
            handleMouseenter,
            handleMouseleave,
            handleRelClick,
            handleClickOutside,
            handleTransferClick,
            handleFocus,
            handleBlur,
            handleConfirm,
            handleCancel,
        };
    },
    components: {
        IvueIcon,
        IvueButton,
    },
});
</script>
