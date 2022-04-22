<template>
    <li :class="classes" @click.stop="handleClickItem" @mouseenter.stop="handleHoverItem">
        {{ item.label }}
        <ivue-icon v-show="showArrow">{{ childrenIcon }}</ivue-icon>
    </li>
</template>

<script lang='ts'>
import {
    defineComponent,
    reactive,
    computed,
    ref,
    getCurrentInstance,
    provide,
    watch,
    nextTick,
    onMounted,
} from 'vue';
import IvueIcon from '../ivue-icon/index.vue';

const prefixCls = 'ivue-cascader-menu--item';

export default defineComponent({
    name: prefixCls,
    emits: ['click', 'mouseenter'],
    props: {
        /**
         * item
         *
         * @type {Object}
         */
        item: {
            type: Object,
        },
        /**
         * 临时item
         *
         * @type {Object}
         */
        tmpItem: {
            type: Object,
        },
        /**
         * 子选项图标
         *
         * @type {String}
         */
        childrenIcon: {
            type: String,
            default: 'keyboard_arrow_right',
        },
    },
    setup(props: any, { emit }) {
        // computed

        // 外层样式
        const classes = computed(() => {
            return [
                `${prefixCls}`,
                {
                    [`${prefixCls}-active`]:
                        props.tmpItem.value === props.item.value,
                    [`${prefixCls}-disabled`]: props.item.disabled,
                },
            ];
        });

        // 显示右图标
        const showArrow = computed(() => {
            return (
                (props.item.children && props.item.children.length) ||
                ('loading' in props.item && !props.item.loading)
            );
        });

        // methods

        // 点击
        const handleClickItem = () => {
            emit('click', props.item);
        };

        // 鼠标移动
        const handleHoverItem = () => {
            emit('mouseenter', props.item);
        };

        return {
            prefixCls,

            // computed
            classes,
            showArrow,

            // methods
            handleClickItem,
            handleHoverItem,
        };
    },
});
</script>
