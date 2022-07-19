<template>
    <div :class="wrapperClass">12</div>
</template>

<script lang='ts'>
import { computed, defineComponent, getCurrentInstance, reactive } from 'vue';

// 表格改变
import TableLayout from './table-layout';

// store
import { createStore } from './store/helper';

const prefixCls = 'ivue-table';

export default defineComponent({
    name: prefixCls,
    props: {
        /**
         * 列的宽度是否自撑开
         *
         * @type {Boolean}
         */
        fit: {
            type: Boolean,
            default: true,
        },
        /**
         * 是否带有纵向边框
         *
         * @type {Boolean}
         */
        border: {
            type: Boolean,
            default: false,
        },
        /**
         * Table 的最大高度。 合法的值为数字或者单位为 px 的高度。
         *
         * @type {String, Number}
         */
        maxHeight: [String, Number],
    },
    setup(props) {
        // vm
        const table = getCurrentInstance();

        const store = createStore(table, props);

        console.log('store', store);
        // table.store = store

        const layout = new TableLayout({
            // store: table.store,
            // table,
            fit: props.fit,
            // showHeader: props.showHeader,
        });

        // table.layout = layout

        console.log('layout', layout);

        // data

        const data = reactive<{
            isGroup: boolean;
        }>({
            /**
             * 是否拥有多级表头
             *
             * @type {Boolean}
             */
            isGroup: false,
        });

        // computed

        // 外层样式
        const wrapperClass = computed(() => {
            return [
                prefixCls,
                {
                    [`${prefixCls}-fit`]: props.fit,
                    [`${prefixCls}-border`]: props.border,
                    [`${prefixCls}-group`]: data.isGroup,
                    [`${prefixCls}-max-height`]: props.maxHeight,
                    //  [ns.m('scrollable-x')]: layout.scrollX.value,
                    // [ns.m('scrollable-y')]: layout.scrollY.value,
                },
            ];
        });

        return {
            // data
            data,

            // computed
            wrapperClass,
        };
    },
});
</script>
