<template>
    <component :class="classes" :is="tagName">
        <!-- 标题 -->
        <div :class="`${prefixCls}-title`" v-if="showTitle">
            <slot name="title">{{ title }}</slot>
        </div>
        <!-- 额外显示的内容，默认位置在右上角 -->
        <div :class="`${prefixCls}-extra`" v-if="showExtra">
            <slot name="extra"></slot>
        </div>
        <!-- 内容 -->
        <div :class="`${prefixCls}-body`" :style="bodyStyles">
            <slot></slot>
        </div>
    </component>
</template>

<script lang='ts'>
import { computed, defineComponent, onMounted, ref } from 'vue';

const prefixCls = 'ivue-card';

export default defineComponent({
    name: prefixCls,
    props: {
        /**
         * 跳转的链接，支持 vue-router 对象
         *
         * @type {Object | String}
         */
        to: {
            type: [Object, String],
        },
        /**
         * 标题
         *
         * @type {String}
         */
        title: {
            type: String,
            default: '',
        },
        /**
         * 是否显示边框，建议在灰色背景下使用
         *
         * @type {Boolean}
         */
        border: {
            type: Boolean,
            default: true,
        },
        /**
         * 卡片阴影，建议在灰色背景下使用
         *
         * @type {Boolean}
         */
        shadow: {
            type: Boolean,
            default: false,
        },
    },
    setup(props: any, { slots }) {
        // 是否显示标题
        const showTitle = ref(false);

        // 额外显示的内容，默认位置在右上角
        const showExtra = ref(false);

        // computed

        // 样式
        const classes = computed(() => {
            return [
                prefixCls,
                {
                    [`${prefixCls}-border`]: props.border && !props.shadow,
                },
            ];
        });

        // 是否是 a 标签
        const isHrefPattern = computed(() => {
            return !!props.to;
        });

        // 标签名称
        const tagName = computed(() => {
            // 是否是跳转链接
            return isHrefPattern.value ? 'a' : 'div';
        });

        // 内容样式
        const bodyStyles = computed(() => {
          return {

          };
        });

        // onMounted
        onMounted(() => {
            // 是否显示头部
            showTitle.value = props.title || slots.title !== undefined;

            // 额外显示的内容，默认位置在右上角
            showExtra.value = slots.extra !== undefined;
        });

        return {
            prefixCls,

            // data
            showTitle,
            showExtra,

            // computed
            tagName,
            classes,
            bodyStyles
        };
    },
});
</script>
