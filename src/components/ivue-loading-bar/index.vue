<template>
    <transition :name="`${prefixCls}-fade`">
        <div :class="prefixCls" :style="outerStyles" v-show="data.visible">
            <div :class="innerClasses" :style="styles"></div>
        </div>
    </transition>
</template>

<script lang='ts'>
import { defineComponent, computed, reactive } from 'vue';

const prefixCls = 'ivue-loading-bar';

export default defineComponent({
    name: prefixCls,
    props: {
        /**
         * 颜色
         *
         * @type {String}
         */
        color: {
            type: String,
            default: 'primary',
        },
        /**
         * 错误颜色
         *
         * @type {String}
         */
        failedColor: {
            type: String,
            default: 'error',
        },
        /**
         * 进度条高度
         *
         * @type {Number}
         */
        height: {
            type: Number,
            default: 2,
        },
    },
    setup(props: any) {
        // data
        const data = reactive<{
            percent: number;
            status: string;
            visible: boolean;
        }>({
            /**
             * 百分比
             *
             * @type {Number}
             */
            percent: 0,
            /**
             * 状态
             *
             * @type {String}
             */
            status: 'success',
            /**
             * 显示
             *
             * @type {Boolean}
             */
            visible: true,
        });

        // computed

        // 内容样式
        const innerClasses = computed(() => {
            return [
                `${prefixCls}-inner`,
                {
                    [`${prefixCls}-inner-color-primary`]:
                        props.color === 'primary' && data.status === 'success',
                    [`${prefixCls}-inner-color-error`]:
                        props.failedColor === 'error' && data.status === 'error',
                },
            ];
        });

        // 外层样式
        const outerStyles = computed(() => {
            return {
                height: `${props.height}px`,
            };
        });

        // styles
        const styles = computed(() => {
            let style = {
                width: `${data.percent}%`,
                height: `${props.height}px`,
                backgroundColor: '',
            };

            if (props.color !== 'primary' && data.status === 'success') {
                style.backgroundColor = props.color;
            }

            if (props.failedColor !== 'error' && data.status === 'error') {
                style.backgroundColor = props.failedColor;
            }

            return style;
        });

        return {
            prefixCls,

            // data
            data,

            // computed
            innerClasses,
            outerStyles,
            styles,
        };
    },
});
</script>
