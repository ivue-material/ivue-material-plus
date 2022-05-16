<template>
    <div :class="prefixCls" @mouseenter="handleShowPopper" @mouseleave="handleClosePopper">
        <div :class="`${prefixCls}-rel`" ref="reference">
            <slot></slot>
        </div>
        <!-- 为封装到组件中来构建 UI -->
        <teleport to="body" :disabled="!transfer">
            <transition name="fade-tooltip">
                <div ref="popper" v-show="!disabled && (data.visible || always)"></div>
            </transition>
        </teleport>
    </div>
</template>

<script lang='ts'>
import { defineComponent, reactive, onMounted } from 'vue';
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
            default: 100,
        },
    },
    setup(props) {
        // data
        const data = reactive<{
            visible: boolean;
            timeout: any;
            zIndex: number;
        }>({
            /**
             * 步骤数
             *
             * @type {String}
             */
            visible: props.modelValue,
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
        });

        // methods

        // 显示
        const handleShowPopper = () => {
            if (data.timeout) {
                clearTimeout(data.timeout);
            }

            // 延迟时间
            data.timeout = setTimeout(() => {
                data.visible = true;
            }, props.delay);

            data.zIndex = handleGetIndex();
        };

        // 隐藏
        const handleClosePopper = () => {};

        // 获取index
        const handleGetIndex = () => {
            transferIncrease();

            return transferIndex;
        };

        return {
            prefixCls,
            // data
            data,
            // methods
            handleShowPopper,
            handleClosePopper,
        };
    },
});
</script>
