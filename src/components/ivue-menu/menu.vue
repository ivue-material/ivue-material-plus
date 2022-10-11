<template>
    <ul :class="wrapperClasses" :style="wrapperStyles">
        <slot></slot>
    </ul>
</template>

<script lang='ts'>
import { computed, onMounted, reactive, provide, watch, nextTick } from 'vue';
import { oneOf } from '../../utils/assist';

// ts
import { MenuContextKey, menuItemList } from './menu';

const prefixCls = 'ivue-menu';

/* eslint-disable */
export default {
    name: prefixCls,
    emits: ['on-select'],
    props: {
        /**
         * 主题，可选值为 light、dark、primary，其中 primary 只适用于 mode="horizontal"
         *
         * @type {String}
         */
        theme: {
            type: String,
            validator(value: string) {
                return oneOf(value, ['light', 'dark', 'primary']);
            },
            default: 'light',
        },
        /**
         * 菜单类型，可选值为 horizontal（水平） 和 vertical（垂直）
         *
         * @type {String}
         */
        mode: {
            type: String,
            validator(value: string) {
                return oneOf(value, ['horizontal', 'vertical']);
            },
            default: 'vertical',
        },
        /**
         * 垂直宽度
         *
         * @type {String}
         */
        width: {
            type: String,
            default: '240px',
        },
        /**
         * 展开的 Submenu 的 name 集合
         *
         * @type {Array}
         */
        openNames: {
            type: Array,
            default() {
                return [];
            },
        },
        /**
         * 激活菜单的 name 值
         *
         * @type {String | Number}
         */
        activeName: {
            type: [String, Number],
        },
    },
    setup(props: any, { emit }) {
        // data
        const data = reactive<{
            openedNames: any[];
            menuItemList: menuItemList[];
            currentActiveName: string | number;
            ready: boolean;
        }>({
            /**
             * 展开的 Submenu 的 name 集合
             *
             * @type {Array}
             */
            openedNames: [],
            /**
             * 子菜单列表
             *
             * @type {Array}
             */
            menuItemList: [],
            /**
             * 当前激活的名称
             *
             * @type {String | Number}
             */
            currentActiveName: props.activeName,
            /**
             * 是否渲染完毕
             *
             * @type {Boolean}
             */
            ready: false,
        });

        // computed

        // 外部样式
        const wrapperClasses = computed(() => {
            let theme = props.theme;

            // 垂直 &&  primary
            if (props.mode === 'vertical' && props.theme === 'primary') {
                theme = 'light';
            }

            return [
                `${prefixCls}`,
                // 主题
                `${prefixCls}-${theme}`,
                {
                    // 菜单类型
                    [`${prefixCls}-${props.mode}`]: props.mode,
                },
            ];
        });

        // 外部样式
        const wrapperStyles = computed(() => {
            let style: {
                width?: string;
            } = {};

            // 垂直宽度
            if (props.mode === 'vertical') {
                style.width = props.width;
            }

            return style;
        });

        // methods

        // 激活当前子菜单
        const updateActiveName = () => {
            // 没有菜单
            if (data.currentActiveName === undefined) {
                data.currentActiveName = -1;
            }

            // 子菜单列表
            data.menuItemList.forEach((item) => {
                // 激活子菜单
                item.activeName(data.currentActiveName);
            });

            //  if (this.currentActiveName === undefined) {
            //         this.currentActiveName = -1;
            //     }
            //     this.submenuList.map(item => item.submenu).forEach(item => {
            //         item.handleUpdateActiveName(false);
            //     });
            //     this.menuItemList.map(item => item.menuitem).forEach(item => {
            //         item.handleUpdateActiveName(this.currentActiveName);
            //     });
        };

        // 激活子菜单
        const menuItemActive = (name: string | number) => {
            // 当前激活的名称
            data.currentActiveName = name;

            emit('on-select', name);
        };

        // 发送选择事件
        const handleEmitSelectEvent = (name: string | number) => {
            emit('on-select', name);
        };

        // provide

        provide(
            MenuContextKey,
            reactive({
                data,
                mode: props.mode,
                menuItemActive,
                handleEmitSelectEvent,
            })
        );

        // watch

        // 监听激活菜单的 name 值
        watch(
            () => props.activeName,
            (value) => {
                data.currentActiveName = value;
            }
        );

        // 监听当前激活的名称
        watch(
            () => data.currentActiveName,
            () => {
                updateActiveName();
            }
        );

        // onMounted
        onMounted(() => {
            // 展开的 Submenu 的 name 集合
            data.openedNames = [...props.openNames];

            nextTick(() => {
                // 激活子菜单
                updateActiveName();

                // 渲染完成
                data.ready = true;
            });
        });

        return {
            prefixCls,

            // data
            data,

            // computed
            wrapperClasses,
            wrapperStyles,
        };
    },
};
</script>
