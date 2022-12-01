<template>
    <div :class="classes">
        <slot></slot>
    </div>
</template>

<script lang='ts'>
import {
    defineComponent,
    reactive,
    computed,
    provide,
    onMounted,
    watch,
} from 'vue';

// type
import { Props, Data, CascaderContextKey } from './types/collapse';
import type { PanelInstance } from './types/panel';

const prefixCls = 'ivue-collapse';

export default defineComponent({
    name: prefixCls,
    emits: ['update:modelValue', 'on-change'],
    props: {
        /**
         * 当前激活的面板的 name
         *
         * @type {Array, String}
         */
        modelValue: {
            type: [Array, String],
        },
        /**
         * 是否开启简洁模式
         *
         * @type {Boolean}
         */
        simple: {
            type: Boolean,
            default: false,
        },
        /**
         * 是否开启手风琴效果
         *
         * @type {Boolean}
         */
        accordion: {
            type: Boolean,
            default: false,
        },
    },
    setup(props: Props, { emit }) {
        // 插入扩展
        const pushExpandable = (expandableListItem: PanelInstance) => {
            const expandableListItems = data.childrenList.expandable;

            // 寻找是否已经有了选项
            const findItem = expandableListItems.find(
                (target: PanelInstance) => {
                    return target.uid === expandableListItem?.uid;
                }
            );

            if (!findItem) {
                data.childrenList.expandable = expandableListItems.concat([
                    expandableListItem,
                ]);
            }
        };

        // 删除扩展
        const removeExpandable = (expandableListItem: PanelInstance) => {
            const expandableListItems = data.childrenList.expandable;

            // 寻找是否已经有了选项
            const findItem = expandableListItems.find(
                (target: PanelInstance) => {
                    return target.uid === expandableListItem.uid;
                }
            );

            if (findItem) {
                data.childrenList.expandable = expandableListItems.filter(
                    (target: PanelInstance) =>
                        target.uid !== expandableListItem.uid
                );
            }
        };

        // 子项点击切换
        const toggle = (obj: { name: string; isActive: boolean }) => {
            const name = obj.name.toString();

            let newActiveKey = [];

            // 是否开启手风琴效果
            const accordion = props.accordion;

            // 手风琴效果
            if (accordion) {
                if (!obj.isActive) {
                    newActiveKey.push(name);
                }
            }
            // 普通效果
            else {
                // 获取当前需要激活的面板
                const activeKey = getActiveKey();

                // 面板的 index
                const nameIndex = activeKey.indexOf(name);

                // 是否已经激活
                if (obj.isActive) {
                    if (nameIndex > -1) {
                        activeKey.splice(nameIndex, 1);
                    }
                } else {
                    if (nameIndex < 0) {
                        activeKey.push(name);
                    }
                }

                newActiveKey = activeKey;
            }

            // 重新设置当前激活的面板
            data.currentValue = newActiveKey;

            // 设置激活
            setActive();

            // 设置 v-model
            emit('update:modelValue', newActiveKey);

            // 切换面板是触发，返回当前展开的面板的 key，格式为数组
            emit('on-change', newActiveKey);
        };

        // data
        const data = reactive<Data>({
            /**
             * 当前值
             *
             * @type {Array, String}
             */
            currentValue: props.modelValue,
            /**
             * 子级
             *
             * @type {Array}
             */
            childrenList: {
                /**
                 * 扩展列表
                 *
                 * @type {Array}
                 */
                expandable: [],
                // 插入扩展
                pushExpandable: pushExpandable,
                // 删除扩展
                removeExpandable: removeExpandable,
                // 切换
                toggle: toggle,
            },
        });

        // computed

        // 外层样式
        const classes = computed(() => {
            return [
                `${prefixCls}`,
                {
                    [`${prefixCls}-simple`]: props.simple,
                },
            ];
        });

        // methods

        // 设置激活的面板
        const setActive = () => {
            const activeKey = getActiveKey();

            const childrenList = data.childrenList.expandable;

            childrenList.forEach((vm: PanelInstance, index: number) => {
                const { proxy } = vm;

                // 子项名称
                const name = proxy.name || index.toString();

                proxy.data.isActive = activeKey.indexOf(name) > -1;
                proxy.data.index = index;
            });
        };

        // 获取激活的key
        const getActiveKey = () => {
            // 获取初始化需要激活的面板
            let activeKey = data.currentValue || [];

            // 是否开启手风琴效果
            const accordion = props.accordion;

            // 判断是否是数组
            if (!Array.isArray(activeKey)) {
                activeKey = [activeKey];
            }

            // 手风琴效果
            if (accordion && activeKey.length > 1) {
                activeKey = [activeKey[0]];
            }

            for (let i = 0; i < activeKey.length; i++) {
                // 把value字符串化
                activeKey[i] = activeKey[i].toString();
            }

            return activeKey;
        };

        // watch

        // 监听 v-modal
        watch(
            () => props.modelValue,
            (value) => {
                data.currentValue = value;
            }
        );

        // 监听当前值
        watch(
            () => data.currentValue,
            () => {
                setActive();
            }
        );

        // provide
        provide(CascaderContextKey, data.childrenList);

        // onMounted
        onMounted(() => {
            setActive();
        });

        return {
            data,

            // computed
            classes,
        };
    },
});
</script>
