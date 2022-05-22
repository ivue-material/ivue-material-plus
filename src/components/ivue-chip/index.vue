<template>
    <div :class="classes" :style="styles" v-show="modelValue">
        <span :class="`${prefixCls}-content`">
            <!-- 内容 -->
            <slot></slot>
            <!-- 关闭按钮 -->
            <slot name="icon">
                <div :class="`${prefixCls}-close`" v-show="close">
                    <ivue-icon @click.stop="handleClose">{{ closeIcon }}</ivue-icon>
                </div>
            </slot>
        </span>
    </div>
</template>

<script lang='ts'>
import { computed, defineComponent } from 'vue';
import IvueIcon from '../ivue-icon/index.vue';

const prefixCls = 'ivue-chip';

function isCssColor(color) {
    return !!color && !!color.match(/^(#|(rgb|hsl)a?\()/);
}

export default defineComponent({
    name: prefixCls,
    emits: ['update:modelValue'],
    props: {
        /**
         * v-modul
         *
         * @type {Boolean}
         */
        modelValue: {
            type: Boolean,
            default: true,
        },
        /**
         * 字体颜色
         *
         * @type {String}
         */
        textColor: {
            type: String,
        },
        /**
         * 颜色
         *
         * @type {String | Array}
         */
        color: {
            type: [String, Array],
        },
        /**
         * 是否禁用
         *
         * @type {Boolean}
         */
        disabled: {
            type: Boolean,
        },
        /**
         * 显示轮廓
         *
         * @type {Boolean}
         */
        outline: {
            type: Boolean,
        },
        /**
         * 正方形边框
         *
         * @type {Boolean}
         */
        square: {
            type: Boolean,
        },
        /**
         * 是否可关闭
         *
         * @type {Boolean}
         */
        close: {
            type: Boolean,
        },
        /**
         * 关闭图标
         *
         * @type {String}
         */
        closeIcon: {
            type: String,
            default: 'cancel',
        },
        /**
         * 保持其背景颜色，但没有框阴影
         *
         * @type {Boolean}
         */
        depressed: {
            type: Boolean,
        },
    },
    setup(props: any, { emit }) {
        // computed

        // 外层样式
        const classes = computed(() => {
            const textColor = props.textColor || (props.outline && props.color);

            let obj = {
                [prefixCls]: true,
                // 禁用
                [`${prefixCls}--disabled`]: props.disabled,
                // 显示轮廓
                [`${prefixCls}--outline`]: props.outline,
                // 正方形边框
                [`${prefixCls}--square`]: props.square,
                // 关闭按钮
                [`${prefixCls}--close`]: props.close,
                // 是否使用hover效果
                [`${prefixCls}--depressed`]: !props.depressed,
            };

            // 文字样式
            const isTextColor: any = setTextColor(textColor);

            if (isTextColor.color && !isCssColor(isTextColor.color)) {
                obj[isTextColor.color] = true;
            }

            // 背景样式
            if (props.color) {
                obj[props.color] = true;
            }

            return obj;
        });

        // 外层样式
        const styles = computed(() => {
            const textColor = props.textColor || (props.outline && props.color);

            let obj: any = {};

            // 文字样式
            const isTextColor: any = setTextColor(textColor);

            if (isTextColor.color && isCssColor(isTextColor.color)) {
                obj.color = isTextColor.color;
            }

            // 背景样式
            if (props.color) {
                obj = {
                    ...obj,
                    ...setBackgroundColor(props.color),
                };
            }

            return obj;
        });

        // methods

        // 设置背景颜色
        const setBackgroundColor = (color: string | any[]) => {
            let style = {};

            // 是否是数组
            if (Array.isArray(color)) {
                style = {
                    background: `linear-gradient(135deg,${color[0]} 0%, ${color[1]} 100%)`,
                };
            } else if (isCssColor(color)) {
                style = {
                    'background-color': `${color}`,
                };
            }

            return style;
        };

        // 设置文字颜色
        const setTextColor = (color: Record<string, any>) => {
            let style = {};

            // 是否是数组
            if (Array.isArray(color)) {
                style = {
                    color: `${color[0]}`,
                };
            } else if (isCssColor(color)) {
                style = {
                    color: `${color}`,
                };
            } else if (color) {
                const [colorName] = color.toString().trim().split(' ', 2);

                style = {
                    color: `${colorName}--text`,
                };
            }

            return style;
        };

        // methods

        // 关闭
        const handleClose = () => {
            emit('update:modelValue', false);
        };

        return {
            prefixCls,

            // computed
            classes,
            styles,

            // methods
            handleClose,
        };
    },
    components: {
        IvueIcon,
    },
});
</script>
