<template>
    <component :class="classes" :is="tagName">
        <div :class="`${prefixCls}-title`" v-if="showTitle">
            <slot name="title"></slot>
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
        bordered: {
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

        // computed

        // 样式
        const classes = computed(() => {
            return [
                prefixCls,
                {
                    [`${prefixCls}-bordered`]: props.bordered && !props.shadow,
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

        // onMounted
        onMounted(() => {
            // 是否显示头部
            showTitle.value = props.title || slots.title !== undefined;
        });

        return {
            prefixCls,

            // data
            showTitle,

            // computed
            tagName,
            classes,
        };
    },
});
</script>
