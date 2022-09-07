<template>
    <div :class="prefixCls" :style="wrapperStyles" ref="wrapper">
        <!-- content -->
        <div :class="`${prefixCls}-content`">
            <img :src="src" :class="imageClasses" :style="imageStyle" v-if="data.loadingImage" />
        </div>
    </div>
</template>

<script lang='ts'>
import { defineComponent, ref, computed, reactive, onMounted } from 'vue';
import { isClient } from '../../utils/helpers';

const prefixCls = 'ivue-image';

export default defineComponent({
    name: prefixCls,
    props: {
        /**
         * 圆角
         *
         * @type {Number}
         */
        radius: {
            type: Number,
            default: 0,
        },
        /**
         * 像素单位
         *
         * @type {String}
         */
        unit: {
            type: String,
            default: 'px',
        },
        /**
         * 图片源地址
         *
         * @type {String}
         */
        src: {
            type: String,
            default: '',
        },
        /**
         * 确定图片如何适应容器框，同原生 object-fit
         *
         * @type {String}
         */
        fit: {
            type: String,
            values: ['', 'contain', 'cover', 'fill', 'none', 'scale-down'],
            default: '',
        },
        /**
         * 图片描述
         *
         * @type {String}
         */
        alt: {
            type: String,
            default: '',
        },
    },
    setup(props: any, { emit }) {
        // dom
        const wrapper = ref<HTMLElement>();

        // data
        const data: any = reactive<{
            loadingImage: boolean;
        }>({
            /**
             * 加载中
             *
             * @type {Boolean}
             */
            loadingImage: true,
        });

        // computed

        // 外部样式
        const wrapperStyles = computed(() => {
            let obj = {};

            // 圆角
            if (props.radius) {
                obj = {
                    borderRadius: `${props.radius}${props.unit}`,
                };
            }

            return obj;
        });

        // 图片样式
        const imageClasses = computed(() => {
            return [`${prefixCls}-img`];
        });

        // 图片样式
        const imageStyle = computed(() => {
            const { fit } = props;

            let obj = {};

            // 确定图片如何适应容器框
            if (isClient && fit) {
                obj = {
                    objectFit: fit,
                };
            }

            return obj;
        });

        // methods

        // onMounted
        onMounted(() => {});

        return {
            prefixCls,

            // dom
            wrapper,

            // data
            data,

            // computed
            wrapperStyles,
            imageClasses,
            imageStyle,

            // methods
        };
    },
});
</script>
