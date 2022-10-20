<template>
    <ivue-svg-loader
        class="ivue-icon ivue-icon-image"
        :style="styles"
        :svgSrc="svgSrc"
        v-if="svgSrc"
        @svg-loaded="handleSvgLoaded"
    ></ivue-svg-loader>
    <i class="ivue-icon ivue-icon-font" :style="styles" v-else>
        <slot />
    </i>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';

import IvueSvgLoader from '../ivue-svg-loader/index';

const prefixCls = 'ivue-icon';

export default defineComponent({
    name: prefixCls,
    emits: ['on-svg-loaded'],
    props: {
        /**
         * svg 链接
         *
         * @type {String}
         */
        svgSrc: {
            type: String,
            default: null,
        },
        /**
         * flex 项排序
         *
         * @type {Number}
         */
        order: {
            type: Number,
        },
    },
    setup(props, { emit }) {
        // computed

        // 样式
        const styles = computed(() => {
            return {
                order: props.order,
            };
        });

        // methods

        // 在获取SVG图标后立即触发
        const handleSvgLoaded = () => {
            emit('on-svg-loaded');
        };

        return {
            // computed
            styles,

            // methods
            handleSvgLoaded,
        };
    },
    components: {
        IvueSvgLoader,
    },
});
</script>
