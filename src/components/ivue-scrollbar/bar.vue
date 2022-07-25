<template>
    <thumb :moveX="data.moveX" :ratioX="ratioX" :barWidth="barWidth" :always="always"></thumb>
</template>

<script lang="ts">
import { defineComponent, reactive } from 'vue';
import Thumb from './thumb.vue';

const prefixCls = 'ivue-scrollbar-bar';

// top 2 + bottom 2
const GAP = 4;

export default defineComponent({
    name: prefixCls,
    props: {
        /**
         * 滚动条总是显示
         *
         * @type {Boolean}
         */
        always: {
            type: Boolean,
            default: false,
        },
        /**
         * 滚动条高度
         *
         * @type {String}
         */
        barHeight: {
            type: String,
            default: '',
        },
        /**
         * 滚动条宽度
         *
         * @type {String}
         */
        barWidth: {
            type: String,
            default: '',
        },
        /**
         * x轴滚动比率
         *
         * @type {Number}
         */
        ratioX: {
            type: Number,
            default: 1,
        },
        /**
         * y轴滚动比率
         *
         * @type {Number}
         */
        ratioY: {
            type: Number,
            default: 1,
        },
    },
    setup(props) {
        // data
        const data: any = reactive<{
            moveX: number;
            moveY: number;
        }>({
            /**
             * x移动的位置
             *
             * @type {Number}
             */
            moveX: 0,
            /**
             * y移动的位置
             *
             * @type {Number}
             */
            moveY: 0,
        });

        // methods

        // 滚动
        const handleScroll = (wrapper: HTMLDivElement) => {
            if (wrapper) {
                const offsetHeight = wrapper.offsetHeight - GAP;
                const offsetWidth = wrapper.offsetWidth - GAP;

                // x移动的位置
                data.moveX =
                    ((wrapper.scrollLeft * 100) / offsetWidth) * props.ratioX;

                // y移动的位置
                data.moveY =
                    ((wrapper.scrollTop * 100) / offsetHeight) * props.ratioY;
            }
        };

        return {
            // data
            data,

            // methods
            handleScroll,
        };
    },
    components: {
        Thumb,
    },
});
</script>
