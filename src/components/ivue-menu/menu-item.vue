<template>
    <!-- 链接 -->
    <li v-if="$router && to">
        <slot name="link">
            <a
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
        </slot>
    </li>

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
    ref,
} from 'vue';
import { mixinsLink } from '../../utils/mixins/mixins-link';
import { findComponentUpward, findComponentsUpward } from '../../utils/helpers';
import { oneOf } from '../../utils/assist';

// ts
import { MenuContextKey } from './types/menu';
import { SubmenuContextKey } from './types/submenu';
import { _ComponentInternalInstance, Props } from './types/menu-item';

const prefixCls = 'ivue-menu-item';

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
        /**
         * 跳转的链接，支持 vue-router 对象
         *
         * @type {Object | String}
         */
        to: {
            type: [Object, String],
        },
        /**
         * 相当于 a 链接的 target 属性
         *
         * @type {String}
         */
        target: {
            type: String,
            validator(value: string) {
                return oneOf(value, ['_blank', '_self', '_parent', '_top']);
            },
            default: '_self',
        },
        /**
         * 路由跳转时，开启 replace 将不会向 history 添加新记录
         *
         * @type {Boolean}
         */
        replace: {
            type: Boolean,
            default: false,
        },
    },
    setup(props: Props) {
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

        // route link
        const { handleCheckClick, handleOpenTo, handleLink, linkUrl } =
            mixinsLink(proxy, props);

        // 激活
        const active = ref<boolean>(false);

        // computed

        // 外部样式
        const wrapperClasses = computed(() => {
            return [
                `${prefixCls}`,
                {
                    [`${prefixCls}--active`]: active.value,
                    [`${prefixCls}--selected`]: active.value,
                    [`${prefixCls}--disabled`]: props.disabled,
                },
            ];
        });

        // 外部样式
        const wrapperStyles = computed(() => {
            const styles: {
                paddingLeft?: string;
            } = {};

            const len = findComponentsUpward(proxy, 'ivue-menu-submenu').length;

            if (Submenu.default !== null && Menu.mode !== 'horizontal') {
                styles.paddingLeft = `${43 + (len - 1) * 24}px`;
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
                handleCheckClick(event, newWindow);

                // 发送选择事件
                Menu.handleEmitSelectEvent(props.name);
            }
            // 没有打开新窗口
            else {
                const parent = findComponentUpward(proxy, 'ivue-menu-submenu');

                // 选择当前菜单
                if (parent) {
                    Submenu.handleMenuItemSelect(props.name);
                }
                // 激活子菜单
                else {
                    Menu.menuItemActive(props.name);
                }

                // 如果是 newWindow，直接新开窗口就行，无需发送状态
                handleCheckClick(event, newWindow);
            }
        };

        // 激活当前菜单
        const activeName = (name: string | number) => {
            // 激活
            if (props.name === name) {
                active.value = true;

                if (Submenu.activeName) {
                    Submenu.activeName(name);
                }
            }
            // 取消激活
            else {
                active.value = false;
            }
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
            active,

            // computed
            wrapperClasses,
            wrapperStyles,
            linkUrl,

            // methods
            handleActive,
            handleCheckClick,
            handleOpenTo,
            handleLink,
        };
    },
};
</script>
