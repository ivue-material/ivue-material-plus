<template>
    <span>
        <ul v-if="options && options.length" :class="prefixCls">
            <menu-item
                v-for="(item, index) in options"
                :item="item"
                :tmpItem="data.tmpItem"
                :key="getKey() + index"
                @click="handleClickItem"
                @mouseenter="handleHoverItem"
            ></menu-item>
        </ul>
        <ivue-cascader-menu
            ref="menu"
            :options="data.sublist"
            :disabled="disabled"
            :trigger="trigger"
            :changeOnSelect="changeOnSelect"
            v-if="data.sublist && data.sublist.length"
        ></ivue-cascader-menu>
    </span>
</template>


<script lang='ts'>
import {
    defineComponent,
    reactive,
    ref,
    getCurrentInstance,
    watch,
    nextTick,
    inject,
} from 'vue';

import MenuItem from './menu-item.vue';

// ts
import {
    tmpItem,
    result,
    Options,
    MenuItemInstance,
    CascaderContextKey,
} from './cascader';

const prefixCls = 'ivue-cascader-menu';

let key = 1;

export default defineComponent({
    name: prefixCls,
    emits: ['on-sublist'],
    props: {
        /**
         * 可选项的数据源
         *
         * @type {Array}
         */
        options: {
            type: Array,
            default() {
                return [];
            },
        },
        /**
         * 是否禁用选择组件
         *
         * @type {Boolean}
         */
        disabled: {
            type: Boolean,
            default: false,
        },
        /**
         * 当此项为 true 时，点选每级菜单选项值都会发生变化
         *
         * @type {Boolean}
         */
        changeOnSelect: {
            type: Boolean,
            default: false,
        },
        /**
         * 次级菜单展开方式，可选值为 click 或 hover
         *
         * @type {String}
         */
        trigger: {
            type: String,
        },
    },
    setup(props: any) {
        const menu = ref<HTMLElement | any>(null);

        // vm
        const { ctx }: any = getCurrentInstance();

        // inject
        const cascader = inject(CascaderContextKey);

        // data
        const data = reactive<{
            tmpItem: tmpItem;
            sublist: MenuItemInstance[];
            result: result[];
        }>({
            // 临时item
            tmpItem: {},
            // 子列表
            sublist: [],
            // 结果
            result: [],
        });

        // methods

        // 获取key
        const getKey = () => {
            return key++;
        };

        // 获取基础项
        const getBaseItem = (item) => {
            const backItem = Object.assign({}, item);

            if (backItem.children) {
                delete backItem.children;
            }

            return backItem;
        };

        // 发现选择项
        const handleFindSelected = (params) => {
            const val = params.value;
            const value = [...val];

            for (let i = 0; i < value.length; i++) {
                for (let j = 0; j < props.options.length; j++) {
                    if (value[i] === props.options[j].value) {
                        // 点击当前选项
                        handleTriggerItem(props.options[j], true);

                        value.splice(0, 1);

                        nextTick(() => {
                            if (menu.value) {
                                menu.value.handleFindSelected({
                                    value: value,
                                });
                            }
                        });

                        return false;
                    }
                }
            }
        };

        // 当前点击的选项
        const handleTriggerItem = (
            item: Options,
            fromInit = false as boolean,
            fromUser = false as boolean
        ) => {
            // 禁用
            if (item.disabled) {
                return;
            }

            // 没有loading 没有子项
            if (item.loading !== undefined && !item.children.length) {
                if (cascader.props.loadData) {
                    cascader.props.loadData(item, () => {
                        // 加载子项
                        if (fromUser) {
                            cascader.data.isLoadedChildren = true;
                        }

                        // 有子项
                        if (item.children.length) {
                            handleTriggerItem(item);
                        }
                    });

                    return;
                }
            }

            // return value back recursion  // 向上递归，设置临时选中值（并非真实选中）
            const backItem = getBaseItem(item);

            // 点选每级菜单选项值都会发生变化
            if (
                props.changeOnSelect ||
                backItem.label !== data.tmpItem.label ||
                backItem.value !== data.tmpItem.value ||
                (backItem.label === data.tmpItem.label &&
                    backItem.value === data.tmpItem.value)
            ) {
                data.tmpItem = backItem;

                // 更新结果
                emitUpdate([backItem]);
            }

            // 有子选项
            if (item.children && item.children.length) {
                // 子列表
                data.sublist = item.children;

                // 结果变化
                cascader.handleResultChange({
                    lastValue: false,
                    changeOnSelect: props.changeOnSelect,
                    fromInit: fromInit,
                });

                // 点选每级菜单选项值都会发生变化 清除选择的数据
                if (props.changeOnSelect) {
                    nextTick(() => {
                        menu.value.handleClear();
                    });
                }
            } else {
                // 子列表
                data.sublist = [];

                // 结果变化
                cascader.handleResultChange({
                    lastValue: true,
                    changeOnSelect: props.changeOnSelect,
                    fromInit: fromInit,
                });
            }

            // 下拉框更新位置
            cascader.dropdown.update();
        };

        // 点击选项
        const handleClickItem = (item) => {
            // 次级菜单展开方式 hover
            if (
                props.trigger !== 'click' &&
                item.children &&
                item.children.length
            ) {
                return;
            }

            // 当前点击的选项
            handleTriggerItem(item, false, true);
        };

        // 鼠标hover
        const handleHoverItem = (item) => {
            if (
                props.trigger !== 'hover' ||
                !item.children ||
                !item.children.length
            ) {
                return;
            }

            // 当前点击的选项
            handleTriggerItem(item, false, true);
        };

        // 清除数据
        const handleClear = () => {
            data.sublist = [];
            data.tmpItem = {};
        };

        // 更新结果
        const emitUpdate = (result) => {
            const name = ctx.$parent.$options.name;

            if (name === prefixCls) {
                ctx.$parent.updateResult(result);
            } else {
                cascader.updateResult(result);
            }
        };

        // 更新结果
        const updateResult = (item) => {
            data.result = [data.tmpItem].concat(item);

            emitUpdate(data.result);
        };

        // 监听可选项的数据源
        watch(
            () => props.options,
            () => {
                data.sublist = [];
            }
        );

        return {
            prefixCls,
            // dom
            menu,

            // data
            data,

            // methods
            getKey,
            handleClickItem,
            handleHoverItem,
            handleFindSelected,
            handleClear,
            updateResult,
        };
    },
    components: {
        MenuItem,
    },
});
</script>
