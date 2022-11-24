<template>
    <li :class="prefixCls">
        <!-- 标题 -->
        <div :class="`${prefixCls}__title`" :style="wrapperStyles">{{ title }}</div>
        <ul>
            <slot></slot>
        </ul>
    </li>
</template>

<script lang='ts'>
import { computed, getCurrentInstance, inject } from 'vue';
const prefixCls = 'ivue-menu-item--group';

import { findComponentsUpward } from '../../utils/helpers';

// ts
import { SubmenuContextKey } from './submenu';
import { MenuContextKey } from './menu';

export default {
    name: 'prefixCls',
    props: {
        /**
         * 标题
         *
         * @type {String}
         */
        title: {
            type: String,
            default: '',
        },
    },
    setup() {
        // vm
        const { proxy } = getCurrentInstance();

        // inject
        const Menu = inject(MenuContextKey, {
            default: null,
        });

        const Submenu = inject(SubmenuContextKey, {
            default: null,
        });

        // 外部样式
        const wrapperStyles = computed(() => {
            const len = findComponentsUpward(proxy, 'ivue-menu-submenu').length;

            if (!Submenu.default && Menu.mode !== 'horizontal' && (len - 1) >= 0) {
                return {
                    paddingLeft: `${43 + (len - 1) * 24}px`,
                };
            }

            return {};
        });

        return {
            prefixCls,

            // computed
            wrapperStyles,
        };
    },
};
</script>
