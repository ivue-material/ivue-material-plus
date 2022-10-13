<template>
    <li :class="wrapperClasses" @mouseenter="handleMouseenter" @mouseleave="handleMouseleave">
        <div
            :class="`${prefixCls}--title`"
            ref="reference"
            @click.stop="handleTitleClick"
            :style="titleStyle"
        >
            <slot name="title"></slot>
            <ivue-icon :class="`${prefixCls}--icon`">expand_more</ivue-icon>
            <!-- <Icon
                :type="arrowType"
                :custom="customArrowType"
                :size="arrowSize"
                :class="[prefixCls + '-submenu-title-icon']"
            />-->
        </div>
        <!-- 垂直打开 -->
        <collapse-transition v-if="Menu.mode === 'vertical'"></collapse-transition>
        <!-- 水平打开 -->
        <drop-down
            :visible="data.opened"
            placement="bottom"
            transition-name="slide-up"
            :styles="dropDownStyle"
            ref="dropDown"
            v-if="Menu.mode === 'horizontal'"
        >
            <ul class="ivue-menu-dropdown--list">
                <slot></slot>
            </ul>
        </drop-down>
    </li>
</template>

<script lang='ts'>
import {
    computed,
    getCurrentInstance,
    inject,
    onBeforeUnmount,
    onMounted,
    reactive,
    ref,
    watch,
    ComponentInternalInstance,
    provide,
} from 'vue';
import CollapseTransition from '../../utils/collapse-transition';
import { getStyle } from '../../utils/assist';
import { findComponentUpward } from '../../utils/helpers';

// 下拉框
import DropDown from './drop-down.vue';
// ts
import { MenuContextKey, SubmenuProxy, SubmenuList } from './menu';
import { SubmenuContextKey } from './submenu';

const prefixCls = 'ivue-menu-submenu';

export default {
    name: prefixCls,
    props: {
        /**
         * 菜单项的唯一标识，必填
         *
         * @type {String | NUmber}
         */
        name: {
            type: [String, Number],
            required: true,
        },
        /**
         * 禁用
         *
         * @type {Boolean}
         */
        disabled: {
            type: Boolean,
            default: false,
        },
    },
    setup(props: any) {
        // vm
        const { proxy, uid } =
            getCurrentInstance() as ComponentInternalInstance;

        // dom
        const reference = ref<HTMLDivElement>();
        const dropDown = ref();

        // inject
        const Menu = inject(MenuContextKey, {
            default: null,
        });

        const Submenu = inject(SubmenuContextKey, {
            default: null,
        });

        // data
        const data = reactive<{
            opened: boolean;
            dropWidth: number;
            timeout: ReturnType<typeof setTimeout> | null;
            childSubmenuList: SubmenuList[];
            active: boolean | number | string;
        }>({
            /**
             * 展开
             *
             * @type {Boolean}
             */
            opened: false,
            /**
             * 下拉框宽度
             *
             * @type {Number}
             */
            dropWidth: parseFloat(getStyle(proxy.$el, 'width')),
            /**
             * 延迟
             *
             * @type {Function}
             */
            timeout: null,
            /**
             * 子菜单列表
             *
             * @type {Array}
             */
            childSubmenuList: [],
            /**
             * 是否激活
             *
             * @type {Boolean}
             */
            active: false,
        });

        // computed

        // 外部样式
        const wrapperClasses = computed(() => {
            return [
                prefixCls,
                {
                    // 激活
                    [`${prefixCls}--active`]:
                        data.active && !Submenu.default,
                    // 子菜单激活
                    [`${prefixCls}--child-active`]: data.active,
                    // 打开下拉框
                    [`${prefixCls}--opened`]: data.opened,
                },
            ];
        });

        // 标题样式
        const titleStyle = computed(() => {
            return {};
        });

        // 下拉框样式
        const dropDownStyle = computed(() => {
            let style = {
                minWidth: 'auto',
            };

            if (data.dropWidth) {
                style.minWidth = `${data.dropWidth}px`;
            }

            return style;
        });

        // methods

        // 标题点击
        const handleTitleClick = () => {
            // 禁用
            if (props.disabled) {
                return;
            }

            // 水平
            if (Menu.mode === 'horizontal') {
                return;
            }

            const opened = data.opened;

            data.opened = !opened;

            // 更新打开的菜单名称
            Menu.updateOpenKeys(props.name);
        };

        // 鼠标进入
        const handleMouseenter = () => {
            // 禁用
            if (props.disabled) {
                return;
            }

            // 垂直
            if (Menu.mode === 'vertical') {
                return;
            }

            clearTimeout(data.timeout);

            data.timeout = setTimeout(() => {
                // 更新打开的菜单名称
                Menu.updateOpenKeys(props.name);

                data.opened = true;
            }, 250);
        };

        // 鼠标离开
        const handleMouseleave = () => {
            // 禁用
            if (props.disabled) {
                return;
            }

            // 垂直
            if (Menu.mode === 'vertical') {
                return;
            }

            clearTimeout(data.timeout);
            data.timeout = setTimeout(() => {
                // 更新打开的菜单名称
                Menu.updateOpenKeys(props.name);

                data.opened = false;
            }, 150);
        };

        // 添加子菜单
        const addSubmenu = () => {
            const { submenuList } = Menu.data;

            // 插入当前子菜单
            if (submenuList) {
                submenuList.push({
                    uid: uid,
                    submenu: proxy as unknown as SubmenuProxy,
                });
            }

            // 查找父子菜单
            const parentSubmenu = findComponentUpward(proxy, prefixCls);

            if (parentSubmenu) {
                if (!parentSubmenu.data.childSubmenuList) {
                    parentSubmenu.data.childSubmenuList = [];
                }

                parentSubmenu.data.childSubmenuList.push({
                    uid: uid,
                    submenu: proxy as unknown as SubmenuProxy,
                });
            }
        };

        // 删除子菜单
        const removeSubmenu = () => {
            const { submenuList } = Menu.data;

            if (submenuList && submenuList.length) {
                const index = submenuList.findIndex((item) => item.uid === uid);

                submenuList.splice(index, 1);
            }
        };

        // 更新激活的名称
        const activeName = (status: boolean | string | number) => {
            if (findComponentUpward(proxy, 'ivue-menu-submenu')) {
                Submenu.activeName(status);
            }

            // 子菜单列表
            if (data.childSubmenuList && data.childSubmenuList.length) {
                data.childSubmenuList
                    .map((item) => item.submenu)
                    .forEach((item) => {
                        item.data.active = false;
                    });
            }

            // 激活
            data.active = status;
        };

        // 菜单选择
        const handleMenuItemSelect = (name) => {
            // 水平
            if (Menu.mode === 'horizontal') {
                data.opened = false;
            }

            Menu.handleMenuItemSelect(name);
        };

        // watch

        // 监听模式变化
        watch(
            () => Menu.mode,
            (value) => {
                // 水平
                if (value === 'horizontal') {
                    dropDown.value.update();
                }
            }
        );

        // 监听打开
        watch(
            () => data.opened,
            (value) => {
                // 垂直打开
                if (Menu.mode === 'vertical') {
                    return;
                }

                // 打开下拉框
                if (value) {
                    // 下拉框宽度
                    data.dropWidth = parseFloat(getStyle(proxy.$el, 'width'));

                    dropDown.value.update();
                }
                // 销毁下拉框
                else {
                    dropDown.value.destroy();
                }
            }
        );

        // provide

        provide(
            SubmenuContextKey,
            reactive({
                activeName,
                handleMenuItemSelect,
            })
        );

        // onMounted
        onMounted(() => {
            addSubmenu();
        });

        // onBeforeUnmount
        onBeforeUnmount(() => {
            removeSubmenu();
        });

        return {
            prefixCls,

            // dom
            reference,
            dropDown,

            // data
            data,

            // inject
            Menu,

            // computed
            wrapperClasses,
            titleStyle,
            dropDownStyle,

            // methods
            activeName,
            handleTitleClick,
            handleMouseenter,
            handleMouseleave,
            handleMenuItemSelect,
        };
    },
    components: {
        CollapseTransition,
        DropDown,
    },
};
</script>
