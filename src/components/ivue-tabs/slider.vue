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
    },
    setup(props: any) {
        // computed

        const sliderWrapperStyles = computed(() => {
            const regexp = new RegExp(/[a-zA-Z]/g);

            // 是否有单位
            const isUnitSliderLeft = regexp.test(props.sliderLeft);
            const isUnitSliderWidth = regexp.test(props.sliderWidth);

            return {
                left: !isUnitSliderLeft
                    ? `${props.sliderLeft}px`
                    : props.sliderLeft,
                width: !isUnitSliderWidth
                    ? `${props.sliderWidth}px`
                    : props.sliderWidth,
                transition: props.sliderLeft !== 0 ? null : 'none',
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


        return {
            // computed
            sliderWrapperStyles,
            sliderClass,
            sliderStyles,
        };
    },
});
</script>
