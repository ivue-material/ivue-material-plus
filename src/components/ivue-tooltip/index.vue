<template>
    <div
        :class="prefixCls"
        v-click-outside:[capture]="handleClickOutside"
        @click="handleClickShowPopper"
        @mouseenter="handleMouseenter"
        @mouseleave="handleMouseleave"
    >
        <!-- 描述 -->
        <div :class="`${prefixCls}-rel`" ref="reference">
            <slot></slot>
        </div>
        <!-- 为封装到组件中来构建 UI -->
        <teleport to="body" :disabled="!transfer">
            <transition name="fade-tooltip">
                <div
                    ref="popper"
                    :class="popperClasses"
                    :style="popperStyles"
                    @click.stop
                    @mouseenter="handleMouseenter"
                    @mouseleave="handleMouseleave"
                    v-show="!disabled && (visible || always)"
                >
                    <div :class="[`${prefixCls}-content`]">
                        <!-- arrow -->
                        <div :class="[`${prefixCls}-arrow`]" ref="arrow" v-show="!noArrow"></div>
                        <!-- 内容 -->
                        <div :class="innerClasses" :style="innerStyles">
                            <slot name="content">{{ content }}</slot>
                        </div>
                    </div>
                </div>
            </transition>
        </teleport>
    </div>
</template>

<script lang='ts'>
import {
    defineComponent,
    onMounted,
    getCurrentInstance,
    computed,
    watch,
    ref,
} from 'vue';

// utils
import { transferIndex, transferIncrease } from '../../utils/transfer-queue';
import { oneOf } from '../../utils/assist';
import Popper from '../../utils/mixins/popper';
// 注册外部点击事件插件
import { ClickOutside } from '../../utils/directives';

// ts
import { _ComponentInternalInstance, Props } from './types/tooltip';

const prefixCls = 'ivue-tooltip';

export default defineComponent({
    name: prefixCls,
    mixins: [Popper],
    // 注册局部指令
    directives: { ClickOutside },
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
         * 是否显示
         *
         * @type {Boolean}
         */
        modelValue: {
            type: Boolean,
            default: false,
        },
        /**
         * 是否禁用提示框
         *
         * @type {Boolean}
         */
        disabled: {
            type: Boolean,
            default: false,
        },
        /**
         * 是否总是可见
         *
         * @type {Boolean}
         */
        always: {
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
            default: 0,
        },
        /**
         * 鼠标离开时Tooltip不会关闭
         *
         * @type {Boolean}
         */
        controlled: {
            type: Boolean,
            default: false,
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
         * 提示框的内容
         *
         * @type {String, Number}
         */
        content: {
            type: [String, Number],
            default: '',
        },
        /**
         * 最大宽度，超出最大值后，文本将自动换行，并两端对齐
         *
         * @type {String, Number}
         */
        maxWidth: {
            type: [String, Number],
        },
        /**
         * 显示前执行
         *
         * @type {Function}
         */
        beforeShowPopper: {
            type: Function,
        },
        /**
         * 是否手动控制 Tooltip
         *
         * @type {Boolean}
         */
        manual: {
            type: Boolean,
            default: false,
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
         * 不显示三角形
         *
         * @type {Boolean}
         */
        noArrow: {
            type: Boolean,
            default: false,
        },
        /**
         * 弹窗的展开方向
         *
         * @type {String}
         */
        placement: {
            type: String,
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
    },
    setup(props: Props) {
        // 支持访问内部组件实例
        const { proxy } = getCurrentInstance() as _ComponentInternalInstance;

        // dom
        const popper = ref<HTMLElement>(null);
        const reference = ref<HTMLElement>(null);

        // 延迟
        const timeout = ref<ReturnType<typeof setTimeout> | null>(null);
        // 当前元素index
        const zIndex = ref<number>(0);

        // 显示隐藏
        const visible = ref<boolean>(props.modelValue);

        // computed

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
            const styles = {};

            // 是否将弹层放置于 body 内
            if (props.transfer) {
                styles['z-index'] = 1060 + zIndex.value;
            }

            return styles;
        });

        // 内容
        const innerClasses = computed(() => {
            return [
                `${prefixCls}-inner`,
                {
                    [`${prefixCls}-inner-with-width`]: !!props.maxWidth,
                },
            ];
        });

        // 内容
        const innerStyles = computed(() => {
            const styles = {};

            if (props.maxWidth) {
                styles['max-width'] = `${props.maxWidth}px`;
            }

            return styles;
        });

        // methods

        // 显示
        const handleShowPopper = (event) => {
            // 显示前执行
            if (props.beforeShowPopper) {
                const beforeShowPopper = props.beforeShowPopper(event);

                // 是否执行下一步
                if (!beforeShowPopper) {
                    return;
                }
            }

            if (timeout.value) {
                clearTimeout(timeout.value);
            }

            // 延迟时间
            timeout.value = setTimeout(() => {
                visible.value = true;
            }, props.delay);

            zIndex.value = handleGetIndex();
        };

        // 隐藏
        const handleClosePopper = () => {
            // 清除延迟
            if (timeout.value) {
                clearTimeout(timeout.value);

                // 鼠标离开时Tooltip不会关闭
                if (!props.controlled) {
                    timeout.value = setTimeout(() => {
                        visible.value = false;
                    }, 100);
                }
            }
        };

        // 获取index
        const handleGetIndex = () => {
            transferIncrease();

            return transferIndex;
        };

        // 鼠标进入
        const handleMouseenter = (event) => {
            // 是否手动控制
            if (props.manual) {
                return;
            }

            // 是否显示
            if (visible.value) {
                // 清除定时器
                if (timeout.value) {
                    clearTimeout(timeout.value);
                }

                return;
            }

            handleShowPopper(event);
        };

        // 鼠标离开
        const handleMouseleave = () => {
            // 是否手动控制
            if (props.manual) {
                return;
            }

            handleClosePopper();
        };

        // 点击显示
        const handleClickShowPopper = (event) => {
            // 是否手动控制
            if (!props.manual) {
                return;
            }

            handleShowPopper(event);
        };

        // 点击外部
        const handleClickOutside = () => {
            // 是否手动控制
            if (!props.manual) {
                return;
            }

            // 是否显示
            if (!visible.value) {
                return;
            }

            handleClosePopper();
        };

        // watch

        watch(
            () => props.content,
            () => {
                proxy.updatePopper();
            }
        );

        // onMounted
        onMounted(() => {
            zIndex.value = handleGetIndex();

            // 是否总是可见
            if (props.always) {
                proxy.updatePopper();
            }
        });

        return {
            prefixCls,

            // dom
            popper,
            reference,

            // data
            visible,

            // computed
            popperClasses,
            popperStyles,
            innerClasses,
            innerStyles,

            // methods
            handleShowPopper,
            handleClosePopper,
            handleClickShowPopper,
            handleClickOutside,
            handleMouseenter,
            handleMouseleave,
        };
    },
});
</script>
