<template>
    <ul :class="wrapClass">
        <!-- 数据总条数 -->
        <span :class="`${prefixCls}-total`" v-if="showTotal">
            <slot name="total">{{ `共 ${total} 条` }}</slot>
        </span>
        <!-- 上一页按钮 -->
        <li :class="prevClass">
            <slot name="prev">
                <ivue-icon>{{ prevIcon }}</ivue-icon>
            </slot>
        </li>
    </ul>
</template>

<script lang='ts'>
import { defineComponent, computed, reactive, onMounted, watch } from 'vue';
import IvueIcon from '../ivue-icon/index.vue';

const prefixCls = 'ivue-page';

export default defineComponent({
    name: prefixCls,
    props: {
        /**
         * v-model
         *
         * @type {Number}
         */
        modelValue: {
            type: Number,
            default: 1,
        },
        /**
         * 显示总条数
         *
         * @type {Boolean}
         */
        showTotal: {
            type: Boolean,
            default: false,
        },
        /**
         * 数据总数
         *
         * @type {Number}
         */
        total: {
            type: Number,
            default: 0,
        },
        /**
         * 上一页图标
         *
         * @type {String}
         */
        prevIcon: {
            type: String,
            default: 'keyboard_arrow_left',
        },
        /**
         * 下一页图标
         *
         * @type {String}
         */
        nextIcon: {
            type: String,
            default: 'keyboard_arrow_right',
        },
    },
    setup(props: any, { slots }) {
        // data
        const data = reactive({
            // 当前页数
            currentPage: props.modelValue,
        });

        // 外层样式
        const wrapClass = computed(() => {
            return [prefixCls];
        });

        // 上一页样式
        const prevClass = computed(() => {
            return [
                `${prefixCls}-prev`,
                itemClass.value,
                {
                    [`${prefixCls}-slot`]: slots.prev,
                },
            ];
        });

        // 选项样式
        const itemClass = computed(() => {
            return {
                [`${prefixCls}-item`]: true,
            };
        });

        return {
            prefixCls,
            // data
            data,
            // computed
            wrapClass,
            prevClass,
            itemClass,
        };
    },
    components: {
        IvueIcon,
    },
});
</script>
