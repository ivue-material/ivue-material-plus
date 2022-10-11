<template>
    <!-- 链接 -->
    <a
        v-if="to"
        :class="wrapperClasses"
        :style="wrapperStyles"
        :href="linkUrl"
        :target="target"
        @click.exact="handleActive($event, false)"
        @click.ctrl="handleActive($event, true)"
        @click.meta="handleActive($event, true)"
    >
        <slot></slot>
    </a>
    <!-- 普通标签 -->
    <li v-else :class="wrapperClasses" :style="wrapperStyles" @click="handleActive">
        <slot></slot>
    </li>
</template>

<script lang='ts'>
import {
    computed,
    getCurrentInstance,
    inject,
    onBeforeMount,
    onMounted,
    reactive,
} from 'vue';
import mixinsLink from '../../utils/mixins/mixins-link';

// ts
import { MenuContextKey } from './menu';
import { SubmenuContextKey } from './submenu';
import { _ComponentInternalInstance } from './menu-item';

const prefixCls = 'ivue-menu-item';

/* eslint-disable */

export default {
    name: prefixCls,
    mixins: [mixinsLink],
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
        const { uid, proxy } =
            getCurrentInstance() as _ComponentInternalInstance;

        // inject
        const Menu = inject(MenuContextKey, {
            default: null,
        });

        const Submenu = inject(SubmenuContextKey, {
            default: null,
        });

        // data
        const data = reactive<{
            active: boolean;
        }>({
            /**
             * 激活
             *
             * @type {Boolean}
             */
            active: false,
        });

        // computed

        // 外部样式
        const wrapperClasses = computed(() => {
            return [
                `${prefixCls}`,
                {
                    [`${prefixCls}--active`]: data.active,
                    [`${prefixCls}--selected`]: data.active,
                    [`${prefixCls}--disabled`]: props.disabled,
                },
            ];
        });

        // 外部样式
        const wrapperStyles = computed(() => {
            let styles: {
                paddingLeft?: string;
            } = {};

            if (!!Submenu && Menu.mode !== 'horizontal') {
                // style.paddingLeft = `${
                //     43 + (Submenu.length - 1) * 24
                // }px`;
            }

            return styles;
        });

        // methods

        // 激活
        const handleActive = (event: Event, newWindow = false as boolean) => {
            // 禁用
            if (props.disabled) {
                return;
            }

            // 打开新窗口
            if (newWindow || props.target === '_blank') {
                // 如果是 newWindow，直接新开窗口就行，无需发送状态
                proxy.handleCheckClick(event, newWindow);

                // 发送选择事件
                Menu.handleEmitSelectEvent(props.name);
            }
            // 没有打开新窗口
            else {
                Menu.menuItemActive(props.name);

                // 如果是 newWindow，直接新开窗口就行，无需发送状态
                proxy.handleCheckClick(event, newWindow);
            }
        };

        // 激活当前菜单
        const activeName = (name: string | number) => {
            // 激活
            if (props.name === name) {
                data.active = true;
            }
            // 取消激活
            else {
                data.active = false;
            }
            //  if (this.name === name) {
            //           this.active = true;
            //           if (this.SubmenuInstance) this.SubmenuInstance.handleUpdateActiveName(name);
            //       } else {
            //           this.active = false;
            //       }
        };

        // 添加菜单
        const addMenuItem = () => {
            if (Menu.data) {
                // 插入当前菜单
                Menu.data.menuItemList.push({
                    uid: uid,
                    activeName,
                });
            }
        };

        // 删除菜单
        const removeMenuItem = () => {
            const { menuItemList } = Menu.data;

            if (menuItemList && menuItemList.length) {
                const index = menuItemList.findIndex(
                    (item) => item.uid === uid
                );

                menuItemList.splice(index, 1);
            }
        };

        // onMounted
        onMounted(() => {
            addMenuItem();
        });

        // onBeforeMount
        onBeforeMount(() => {
            removeMenuItem();
        });

        return {
            // data
            data,

            // computed
            wrapperClasses,
            wrapperStyles,

            // methods
            handleActive,
        };
    },
};
</script>
