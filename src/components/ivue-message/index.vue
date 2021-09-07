<template>
    <transition
        :name="`${prefixCls}-message-fade`"
        @before-leave="onClose"
        @after-leave="$emit('destroy')"
    >
        <div
            :class="classes"
            :style="wrapperStyle"
            @mouseenter="handleMouseenter"
            @mouseleave="handleMouseleave"
            v-show="data.visible"
        >
            <div :class="`${baseClass}-content`" ref="content">
                <template v-if="type === 'loading'">
                    <div class="ivue-progress-circular-indeterminate">
                        <i :class="`ivue-icon ${loadingIcon}`" v-if="loadingIcon"></i>

                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            :viewBox="`${viewBoxSize} ${viewBoxSize} ${2 * viewBoxSize} ${2 * viewBoxSize}`"
                            :class="`${prefixCls}-loading ivue-load-loop`"
                            v-else
                        >
                            <circle
                                fill="transparent"
                                :cx="`${2 * viewBoxSize}`"
                                :cy="`${2 * viewBoxSize}`"
                                r="20"
                                :stroke-width="`${strokeWidth}`"
                                :stroke-dasharray="`${strokeDasharray}`"
                                :stroke-dashoffset="`${strokeDashoffset}`"
                                class="ivue-progress-circular-overlay"
                            />
                        </svg>
                    </div>
                    <span v-html="content"></span>
                </template>
                <template v-else>
                    <!-- icon -->
                    <i
                        :class="`ivue-icon ${prefixCls}-icon ${prefixCls}-icon-${type}`"
                    >{{ data.iconTypes[type] }}</i>
                    <!-- 内容 -->
                    <div :class="`${baseClass}-content-text`" v-html="content"></div>
                    <!-- render 渲染 -->
                    <div :class="`${baseClass}-content-text`" v-if="renderFunc">
                        <render-cell :render="renderFunc"></render-cell>
                    </div>
                    <!-- 关闭按钮 -->
                    <div :class="`${baseClass}-close`" @click="handleClose" v-show="closable">
                        <i class="ivue-icon">close</i>
                    </div>
                </template>
            </div>
        </div>
    </transition>
</template>

<script lang='ts'>
import { defineComponent, computed, reactive, onMounted, PropType } from 'vue';

type Position = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
type Type = 'normal' | 'info' | 'warning' | 'success' | 'error';

import RenderCell from '../../utils/render';

const prefixCls = 'ivue-message';

export default defineComponent({
    emits: ['destroy'],
    props: {
        /**
         * 内容
         *
         * @type {String}
         */
        content: {
            type: String,
            default: '',
        },
        /**
         * 类型名称
         *
         * @type {String}
         */
        type: {
            type: String as PropType<Type>,
            default: 'normal',
        },
        /**
         * 样式名称
         *
         * @type {String}
         */
        className: {
            type: String,
        },
        /**
         * 是否有关闭按钮
         *
         * @type {Boolean}
         */
        closable: {
            type: Boolean,
            default: false,
        },
        /**
         * 背景颜色
         *
         * @type {Boolean}
         */
        background: {
            type: Boolean,
            default: false,
        },
        /**
         * render 渲染函数
         *
         * @type {Function}
         */
        render: {
            type: Function,
        },
        /**
         * 是否有图标
         *
         * @type {Boolean}
         */
        haveIcon: {
            type: Boolean,
        },
        /**
         * 关闭方法
         *
         * @type {Function}
         */
        onClose: {
            type: Function,
        },
        /**
         * 通知栏样式
         *
         * @type {String}
         */
        styles: {
            type: Object,
            default: () => {},
        },
        /**
         * 组件名称
         *
         * @type {String}
         */
        id: {
            type: String,
            required: true,
        },
        /**
         * 延迟关闭时间
         *
         * @type {Function}
         */
        duration: {
            type: Number,
            default: 1500,
        },
        /**
         * 偏移位置
         *
         * @type {Number}
         */
        offset: {
            type: Number,
            default: 0,
        },
        /**
         * 自定义弹出位置
         *
         * @type {String}
         */
        position: {
            type: String as PropType<Position>,
            default: 'top-right',
        },
        /**
         * 当前index
         *
         * @type {Numebr}
         */
        zIndex: {
            type: Number,
            default: 0,
        },
        /**
         * 标题
         *
         * @type {String}
         */
        title: {
            type: String,
        },
        /**
         * 描述
         *
         * @type {String}
         */
        desc: {
            type: String,
        },
        /**
         * loading icon
         *
         * @type {String}
         */
        loadingIcon: {
            type: String,
        },
    },
    setup(props: any) {
        const radius = 20;
        const size = 20;
        const percent = 20;
        const viewBoxSize = radius / (1 - 4 / +size);
        const circumference = 2 * Math.PI * radius;
        const strokeDashoffset = ((100 - percent) / 100) * circumference + 'px';
        const strokeDasharray = Math.round(circumference * 1000) / 1000;
        const strokeWidth = (2 / +size) * viewBoxSize * 2;

        // data
        const data: any = reactive<{
            haveDesc: boolean;
            closeTimer: any;
            visible: boolean;
            iconTypes: Record<string, string>;
        }>({
            /**
             * 是否有描述
             *
             * @type {Boolean}
             */
            haveDesc: false,
            /**
             * 关闭时间
             *
             * @type {Function}
             */
            closeTimer: null,
            /**
             * 显示
             *
             * @type {Boolean}
             */
            visible: false,
            /**
             * 图标类型
             *
             * @type {Object}
             */
            iconTypes: {
                success: 'check_circle',
                info: 'info',
                warning: 'warning',
                error: 'error',
            },
        });

        // computed

        // 原始class
        const baseClass = computed(() => {
            return `${prefixCls}-notice`;
        });

        // 外层样式
        const classes = computed(() => {
            const _baseClass = baseClass.value;

            return [
                'ivue-message',
                baseClass.value,
                {
                    [`${props.className}`]: !!props.className,
                    [`${_baseClass}-closable`]: props.closable,
                    [`${_baseClass}-have-background`]: props.background,
                    [`${_baseClass}-have-desc`]: data.haveDesc,
                    [`${_baseClass}-have-background-${props.type}`]:
                        props.background,
                },
            ];
        });

        // 外层样式
        const wrapperStyle = computed(() => {
            return {
                top: `${props.offset}px`,
                'z-index': props.zIndex,
            };
        });

        // 有描述
        const haveDesc = computed(() => {
            return props.render && !props.title
                ? ''
                : props.desc || props.render
                ? `${prefixCls}-have-desc`
                : '';
        });

        // 内容样式
        const contentClasses = computed(() => {
            const _baseClass = baseClass.value;

            return {
                [`${_baseClass}-content`]: true,
                [`${_baseClass}-content-render`]: props.render,
            };
        });

        // 是否有图标
        const contentHaveIcon = computed(() => {
            return {
                [`${prefixCls}-content-have-icon`]: props.type !== 'normal',
            };
        });

        // render 函数
        const renderFunc = computed(() => {
            return props.render;
        });

        // methods

        // 关闭
        const handleClose = () => {
            data.visible = false;
        };

        // 清除关闭时间
        const clearCloseTimer = () => {
            if (data.closeTimer) {
                clearTimeout(data.closeTimer);
                data.closeTimer = null;
            }
        };

        // 开始时间
        const startTime = () => {
            // 重新设置延迟关闭
            if (props.duration > 0) {
                data.closeTimer = setTimeout(() => {
                    handleClose();
                }, props.duration);
            }
        };

        // 鼠标进入
        const handleMouseenter = () => {
            clearTimeout(data.closeTimer);
            data.closeTimer = null;
        };

        // 鼠标移开
        const handleMouseleave = () => {
            startTime();
        };

        // onMounted
        onMounted(() => {
            startTime();

            data.visible = true;
        });

        return {
            prefixCls,

            // data
            data,
            viewBoxSize,
            strokeWidth,
            strokeDasharray,
            strokeDashoffset,

            // computed
            classes,
            baseClass,
            contentClasses,
            contentHaveIcon,
            renderFunc,
            wrapperStyle,
            haveDesc,

            // methods
            handleClose,
            clearCloseTimer,
            handleMouseenter,
            handleMouseleave,
        };
    },
    components: {
        RenderCell,
    },
});
</script>
