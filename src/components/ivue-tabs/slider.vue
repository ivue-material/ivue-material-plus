<template>
    <div class="ivue-tabs-slider-wrapper" :style="sliderWrapperStyles">
        <div :class="sliderClass" :style="sliderStyles"></div>
    </div>
</template>

<script lang='ts'>
import { defineComponent, computed } from 'vue';

function isCssColor(color) {
    return !!color && !!color.match(/^(#|(rgb|hsl)a?\()/);
}

export default defineComponent({
    name: 'ivue-tabs-slider',
    props: {
        /**
         * 颜色
         *
         * @type {String | Array}
         */
        color: {
            type: [String, Array],
            default: '',
        },
        /**
         * 滑动条位置
         *
         * @type {Number}
         */
        sliderLeft: {
            type: Number,
            default: 0,
        },
        /**
         * 滑动条宽度
         *
         * @type {Number}
         */
        sliderWidth: {
            type: Number,
            default: 0,
        },
        /**
         * 样式单位
         *
         * @type {String}
         */
        unit: {
            type: String,
            default: 'px',
        },
    },
    setup(props: any) {
        // computed

        const sliderWrapperStyles = computed(() => {
            return {
                left: `${props.sliderLeft}${props.unit}`,
                transition: props.sliderLeft !== 0 ? null : 'none',
                width: `${props.sliderWidth}${props.unit}`,
            };
        });

        const sliderClass = computed(() => {
            return {
                'ivue-tabs-slider': true,
                [props.color]: !isCssColor(props.color),
            };
        });

        const sliderStyles = computed(() => {
            let style = {};

            if (isCssColor(props.color)) {
                style = {
                    'background-color': `${props.color}`,
                    'border-color': `${props.color}`,
                };
            }

            return style;
        });

        // methods

        // 设置背景颜色
        const setBackgroundColor = (color: string | any[]) => {
            let style = {};

            if (isCssColor(color)) {
                style = {
                    'background-color': `${color}`,
                    'border-color': `${color}`,
                };
            } else if (color) {
                return {
                    class: color,
                };
            }

            return style;
        };

        return {
            // computed
            sliderWrapperStyles,
            sliderClass,
            sliderStyles,

            // methods
            setBackgroundColor,
        };
    },
});
</script>
