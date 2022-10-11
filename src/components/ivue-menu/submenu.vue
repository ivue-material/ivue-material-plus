<template>
    <li :class="wrapperClasses">
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
    </li>
</template>

<script lang='ts'>
import { computed, inject, reactive } from 'vue';
import CollapseTransition from '../../utils/collapse-transition';

// ts
import { MenuContextKey } from './menu';

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
        // inject
        const Menu = inject(MenuContextKey, {
            default: null,
        });

        // data
        const data = reactive<{
            opened: boolean;
        }>({
            /**
             * 展开
             *
             * @type {Boolean}
             */
            opened: false,
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

            // this.menu.updateOpenKeys(this.name);
        };

        return {
            prefixCls,

            // data
            data,

            // computed
            wrapperClasses,
            titleStyle,

            // methods
            handleTitleClick,
        };
    },
    components: {
        CollapseTransition,
    },
};
</script>
