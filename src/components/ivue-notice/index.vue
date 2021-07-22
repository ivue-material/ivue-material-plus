<template>
    <transition :name="transitionName" @enter="handleEnter" @leave="handleLeave" appear>
        <div
            :class="classes"
            :style="styles"
            @mouseenter="handleMouseenter"
            @mouseleave="handleMouseleave"
        >
            <!-- 通知提醒 -->
            <template v-if="type === 'notice'">
                <!-- 内容 -->
                <div :class="contentClasses" ref="content" v-html="content"></div>
                <!-- render 渲染 -->
                <div :class="contentHaveIcon" v-if="renderFunc">
                    <render-cell :render="renderFunc"></render-cell>
                </div>
                <!-- 关闭按钮 -->
                <a :class="`${baseClass}-close`" @click="handleClose" v-show="closable">
                    <i class="ivue-icon">close</i>
                </a>
            </template>
        </div>
    </transition>
</template>

<script lang='ts'>
import {
    defineComponent,
    computed,
    reactive,
    getCurrentInstance,
    onMounted,
    inject,
    PropType
} from 'vue';

type Position = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';

import RenderCell from '../../utils/render';

const prefixCls = 'ivue-notice';

export default defineComponent({
    props: {
        /**
         * 动画名称
         *
         * @type {String}
         */
        transitionName: {
            type: String,
        },
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
            type: String,
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
        name: {
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
            default: 1.5,
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
        zIndex:{
            type: Number,
            default: 0,
        }
    },
    setup(props: any) {
        const { proxy }: any = getCurrentInstance();

        const IvueNotification: {
            close: any;
        } = inject('IvueNotification');

        // data
        const data: any = reactive<{
            haveDesc: boolean;
            closeTimer: any;
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
                baseClass.value,
                {
                    [`${props.className}`]: !!props.className,
                    [`${_baseClass}-closable`]: props.closable,
                    [`${_baseClass}-have-background`]: props.background,
                    [`${_baseClass}-have-desc`]: data.haveDesc,
                },
            ];
        });

        // 当前方向
        const verticalProperty = computed(() => {
            return props.position.startsWith('top') ? 'top' : 'bottom';
        });

        // 外层样式
        const wrapperStyle = computed(() => {
            return {
                [verticalProperty.value]: `${props.offset}px`,
                'z-index': props.zIndex,
            };
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
                [`${prefixCls}-content-have-icon`]: props.haveIcon,
            };
        });

        // render 函数
        const renderFunc = computed(() => {
            return props.render;
        });

        // methods

        // 动画 enter
        const handleEnter = (el) => {
            if (props.type === 'message') {
                el.style.height = `${el.scrollHeight}px`;
            }
        };

        // 动画 leave
        const handleLeave = (el) => {
            if (props.type === 'message') {
                //如果当前只有一个 Message，则不使用 js 过渡动画
                if (
                    document.getElementsByClassName('ivue-message-notice')
                        .length !== 1
                ) {
                    el.style.height = 0;
                    el.style.paddingTop = 0;
                    el.style.paddingBottom = 0;
                }
            }
        };

        // 关闭
        const handleClose = () => {
            clearCloseTimer();

            props.onClose();

            IvueNotification.close(props.name);
        };

        // 清除关闭时间
        const clearCloseTimer = () => {
            if (data.closeTimer) {
                clearTimeout(data.closeTimer);
                data.closeTimer = null;
            }
        };

        // 鼠标进入
        const handleMouseenter = () => {
            clearTimeout(data.closeTimer);
            data.closeTimer = null;
        };

        // 鼠标移开
        const handleMouseleave = () => {
            // 重新设置延迟关闭
            if (props.duration > 0) {
                data.closeTimer = setTimeout(() => {
                    handleClose();
                }, props.duration * 1000);
            }
        };

        // onMounted
        onMounted(() => {
            // 检查是否使用了desc
            // if (props.prefixCls === 'ivue-notice') {
            //     let desc = proxy.$refs.content.querySelectorAll(
            //         `.${props.prefixCls}-desc`
            //     )[0];

            //     data.haveDesc = desc ? desc.innerHTML !== '' : false;
            // }

            // clearCloseTimer();

            // if (props.duration > 0) {
            //     data.closeTimer = setTimeout(() => {
            //         handleClose();
            //     }, props.duration * 1000);
            // }
        });

        return {
            // data
            data,

            // computed
            classes,
            baseClass,
            contentClasses,
            contentHaveIcon,
            renderFunc,
            wrapperStyle,

            // methods
            handleEnter,
            handleLeave,
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
