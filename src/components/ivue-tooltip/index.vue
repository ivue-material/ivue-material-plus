<template>
    <div :class="prefixCls" @mouseenter="handleShowPopper" @mouseleave="handleClosePopper">
        <!-- 描述 -->
        <div :class="`${prefixCls}-rel`" ref="reference">
            <slot></slot>
        </div>
        <!-- 为封装到组件中来构建 UI -->
        <teleport to="body" :disabled="!transfer">
            <transition name="fade-tooltip">
                <div
                    ref="popper"
                    :class="popperClass"
                    :style="popperStyle"
                    @mouseenter="handleShowPopper"
                    @mouseleave="handleClosePopper"
                    v-show="!disabled && (visible || always)"
                >
                    <div :class="[`${prefixCls}-content`]">
                        <!-- arrow -->
                        <div :class="[`${prefixCls}-arrow`]"></div>
                        <!-- 内容 -->
                        <div :class="innerClass" :style="innerStyles">
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
    reactive,
    onMounted,
    getCurrentInstance,
    computed,
    watch,
    ref,
} from 'vue';
import { transferIndex, transferIncrease } from '../../utils/transfer-queue';
import Popper from '../../utils/mixins/popper';

const prefixCls = 'ivue-tooltip';

export default defineComponent({
    name: prefixCls,
    mixins: [Popper],
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
            default: false,
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
    },
    setup(props) {
        // dom
        const popper = ref(null);
        const reference = ref(null);

        // 支持访问内部组件实例
        const { proxy }: any = getCurrentInstance();

        // data

        // 显示隐藏
        const visible = ref(props.modelValue);

        const data = reactive<{
            timeout: any;
            zIndex: number;
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
        });

        // onMounted
        onMounted(() => {
            data.zIndex = handleGetIndex();

            // 是否总是可见
            if (props.always) {
                proxy.updatePopper();
            }
        });

        // 悬浮框样式
        const popperClass = computed(() => {
            return [
                `${prefixCls}-popper`,
                {
                    [`${prefixCls}-transfer`]: props.transfer,
                    // 开启 transfer 时，给浮层添加额外的 class 名称
                    [props.transferClassName]: props.transferClassName,
                },
            ];
        });

        // 悬浮框样式
        const popperStyle = computed(() => {
            let styles = {};

            // 是否将弹层放置于 body 内
            if (props.transfer) {
                styles['z-index'] = 1060 + data.zIndex;
            }

            return styles;
        });

        // 内容
        const innerClass = computed(() => {
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
        const handleShowPopper = () => {
            if (data.timeout) {
                clearTimeout(data.timeout);
            }

            // 延迟时间
            data.timeout = setTimeout(() => {
                visible.value = true;
            }, props.delay);

            data.zIndex = handleGetIndex();
        };

        // 隐藏
        const handleClosePopper = () => {
            // 清除延迟
            if (data.timeout) {
                clearTimeout(data.timeout);

                // 鼠标离开时Tooltip不会关闭
                if (!props.controlled) {
                    data.timeout = setTimeout(() => {
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

        // watch

        watch(
            () => props.content,
            () => {
                proxy.updatePopper();
            }
        );
        return {
            prefixCls,

            // dom
            popper,
            reference,

            // data
            data,
            visible,

            // computed
            popperClass,
            popperStyle,
            innerClass,
            innerStyles,

            // methods
            handleShowPopper,
            handleClosePopper,
        };
    },
});
</script>