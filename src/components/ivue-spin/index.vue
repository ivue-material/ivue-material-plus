<template>
    <transition name="ivue-spin-fade">
        <div :class="wrapperClass">
            <!-- 内容 -->
            <div :class="`${prefixCls}-content`">
                <!-- dot -->
                <div :class="`${prefixCls}-dot`" :style="dotStyle"></div>
                <!-- 提示文字 -->
                <div :class="`${prefixCls}-text`" v-show="$slots.default">
                    <slot></slot>
                </div>
            </div>
        </div>
    </transition>
</template>

<script lang='ts'>
import { defineComponent, computed, reactive, getCurrentInstance } from 'vue';
import Colorable from '../../utils/mixins/colorable';

const prefixCls = 'ivue-spin';

export default defineComponent({
    name: prefixCls,
    mixins: [Colorable],
    props: {
        /**
         * 显示
         *
         * @type {Boolean}
         */
        show: {
            type: Boolean,
            default: true,
        },
        /**
         * 大小
         *
         * @type {Number,String}
         */
        size: {
            type: [Number, String],
        },
    },
    setup(props: any) {
        // 当前实例
        const { proxy }: any = getCurrentInstance();

        // data
        const data = reactive<{
            visible: boolean;
        }>({
            // 使用 $IvueSpin 时显示
            visible: false,
        });

        // computed

        // 外层样式
        const wrapperClass = computed(() => {
            return [`${prefixCls}`];
        });

        // dot样式
        const dotStyle = computed(() => {
            // 大小
            let sizeStyle = {};

            // 是否有大小
            if (props.size) {
                const regexp = new RegExp(/[a-zA-Z]/g);

                // 是否有单位
                const isUnit = regexp.test(props.size);

                const size = !isUnit ? `${props.size}px` : props.size;

                // 样式
                sizeStyle = {
                    height: size,
                    width: size,
                };
            }

            return sizeStyle;
        });

        return {
            prefixCls,
            // data
            data,
            // computed
            wrapperClass,
            dotStyle
        };
    },
});
</script>
