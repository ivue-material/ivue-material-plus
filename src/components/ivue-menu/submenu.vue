<template>
    <li :class="wrapperClasses" @mouseenter="handleMouseenter" @mouseleave="handleMouseleave">
        <div
            :class="`${prefixCls}--title`"
            ref="reference"
            @click.stop="handleTitleClick"
            :style="titleStyle"
        >
            <slot name="title"></slot>
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
            <ul :class="`${prefixCls}-dropdown--list`">
                <slot></slot>1221
            </ul>
        </drop-down>
    </li>
</template>

<script lang='ts'>
import {
    computed,
    getCurrentInstance,
    inject,
    reactive,
    ref,
    watch,
} from 'vue';
import CollapseTransition from '../../utils/collapse-transition';
import { getStyle } from '../../utils/assist';

// 下拉框
import DropDown from './dropdown.vue';
// ts
import { MenuContextKey } from './menu';
import { DropDownRef } from './submenu';

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
        const { proxy } = getCurrentInstance();

        // dom
        const reference = ref<HTMLDivElement>(null);
        const dropDown = ref<DropDownRef>(null);

        // inject
        const Menu = inject(MenuContextKey, {
            default: null,
        });

        // data
        const data = reactive<{
            opened: boolean;
            dropWidth: number;
            timeout: ReturnType<typeof setTimeout> | null;
            childSubmenuList: any[];
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
        });

        // computed

        // 外部样式
        const wrapperClasses = computed(() => {
            return [prefixCls];
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
            handleTitleClick,
            handleMouseenter,
            handleMouseleave,
        };
    },
    components: {
        CollapseTransition,
        DropDown,
    },
};
</script>
