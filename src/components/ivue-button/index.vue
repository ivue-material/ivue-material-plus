<script lang='ts'>
import {
    PropType,
    defineComponent,
    h,
    reactive,
    computed,
    withDirectives,
    resolveDirective,
} from 'vue';

import IvueButtonContent from './content.vue';

import Colorable from '../../utils/mixins/colorable';
import ripple from '../../utils/directives/ripple';
import { oneOf } from '../../utils/assist';

const prefixCls = 'ivue-button';

type Status =
    | 'primary'
    | 'light-primary'
    | 'dark-primary'
    | 'success'
    | 'warning'
    | 'error';

export default defineComponent({
    name: prefixCls,
    mixins: [Colorable],
    directives: {
        ripple,
    },
    emits: ['click'],
    props: {
        /**
         * 当前下标
         *
         * @type {Number, string}
         */
        index: {
            type: [Number, String],
        },
        /**
         * 在按钮上创建一个锚点。在这种情况下，生成的标签将是 a
         *
         * @type {String}
         */
        href: {
            type: String,
            default: null,
        },
        /**
         * 将类型应用于按钮 - 它不会影响链接
         *
         * @type {String}
         */
        type: {
            type: String,
            default: 'button',
        },
        /**
         * 禁用该按钮并阻止其操作
         *
         * @type {Boolean}
         */
        disabled: {
            type: Boolean,
            default: false,
        },
        /**
         * 激活涟漪效果
         *
         * @type {Boolean}
         */
        ripple: {
            type: Boolean,
            default: true,
        },
        /**
         * 是否扁平按钮
         *
         * @type {Boolean}
         */
        flat: {
            type: Boolean,
            default: false,
        },
        /**
         * 凹陷的按钮依然保持其背景色，但没有框阴影
         *
         * @type {Boolean}
         */
        depressed: {
            type: Boolean,
            default: false,
        },
        /**
         * 圆形图标
         *
         * @type {Boolean}
         */
        icon: {
            type: Boolean,
            default: false,
        },
        /**
         * 轮廓按钮从当前色彩应用继承他们的边框颜色。
         *
         * @type {Boolean}
         */
        outline: {
            type: Boolean,
            default: false,
        },
        /**
         * 当使用中心选项时，纹波将始终来自目标的中心。
         *
         * @type {Boolean}
         */
        center: {
            type: Boolean,
            default: false,
        },
        /**
         * 圆角
         *
         * @type {Boolean}
         */
        radius: {
            type: Boolean,
            default: false,
        },
        /**
         * 按钮是否激活状态
         *
         * @type {Boolean}
         */
        isActive: {
            type: Boolean,
            default: false,
        },
        /**
         * 按钮状态
         *
         * @type {String}
         */
        status: {
            type: String as PropType<Status>,
            validator(value: string) {
                return oneOf(value, [
                    'primary',
                    'light-primary',
                    'dark-primary',
                    'success',
                    'warning',
                    'error',
                ]);
            },
        },
        /**
         * 显示loading
         *
         * @type {Boolean}
         */
        loading: {
            type: Boolean,
            default: false,
        },
    },
    // 组合式 API
    setup(props: any) {
        // data
        const data = reactive<{
            rippleActive: boolean;
            mobile: boolean;
        }>({
            /**
             * 波纹效果激活
             *
             * @type {Boolean}
             */
            rippleActive: false,
            /**
             * 是否是移动端
             *
             * @type {Boolean}
             */
            mobile: false,
        });

        // computed

        // 是否显示涟漪效果
        const rippleWorks = computed(() => {
            return !props.disabled && !props.loading;
        });

        // 判断按钮是否激活
        const activeButton = computed(() => {
            if (props.isActive) {
                return `${prefixCls}--active`;
            }

            return '';
        });

        // 按钮样式
        const btnClasses = computed(() => {
            return {
                [`${prefixCls}--raised`]: !props.flat,
                [`${prefixCls}--flat`]: props.flat,
                [`${prefixCls}--depressed`]:
                    (props.depressed && !props.flat) || props.outline,
                [`${prefixCls}--icon`]: props.icon,
                [`${prefixCls}--outline`]: props.outline,
                [`${prefixCls}--radius`]: props.radius,
                [`${prefixCls}--${props.status}`]: props.status && !props.flat,
                [`${prefixCls}--${props.status}__color`]: props.status && (props.flat ||  props.outline),
            };
        });

        // 涟漪效果
        const computedRipple = computed(() => {
            // loading效果
            if (props.loading) {
                return false;
            }

            // 涟漪居中
            if (props.ripple && props.center) {
                return {
                    center: true,
                };
            }
            // 是否开启涟漪
            else if (props.ripple && !props.disabled) {
                return props.ripple;
            }

            return false;
        });

        return {
            // data
            data,

            // computed
            rippleWorks,
            activeButton,
            btnClasses,
            computedRipple,
        };
    },
    render() {
        let _tag = 'button';

        // 按钮内容
        const buttonContent = h(
            IvueButtonContent,
            {
                loading: this.loading,
            },
            this.$slots.default
        );

        // 按钮属性
        let buttonAttrs: {
            class?: Record<string, any>;
            href?: string;
            type?: string;
            disabled?: boolean;
            onTouchstart: (event) => void;
            onTouchmove: (event) => void;
            onClick: (event) => void;
        } = {
            class: {
                [`${prefixCls}`]: true,
                // 移动端
                isMobile: this.data.mobile,
                // 按钮激活
                'ivue-button--active': this.isActive,
                // 蒙版
                [`${prefixCls}--mask`]: this.loading,
                ...this.btnClasses,
            },
            href: this.href,
            type: !this.href && (this.type || 'button'),
            onTouchstart: (event) => {
                // 是否显示涟漪效果
                if (this.rippleWorks) {
                    this.data.rippleActive = event;
                }

                this.mobile = true;
            },
            onTouchmove: (event) => {
                // 是否显示涟漪效果
                if (this.rippleWorks) {
                    this.data.rippleActive = event;
                }
            },
            onClick: (event) => {
                // 是否显示涟漪效果
                if (this.rippleWorks) {
                    this.data.rippleActive = event;
                }

                this.$emit('click', this.data.rippleActive, this.index);
            },
        };

        // 是否禁用
        if (this.disabled) {
            buttonAttrs.disabled = this.disabled;
        }

        // a 标签
        if (this.href) {
            _tag = 'a';
        }

        // 设置颜色
        const setColor =
            !this.outline && !this.flat
                ? this.setBackgroundColor
                : this.setTextColor;

        // 解析指令
        const rippleDirective = resolveDirective('ripple');

        return withDirectives(
            h(_tag, setColor(this.color, buttonAttrs), [buttonContent]),
            [[rippleDirective, this.computedRipple]]
        );
    },
});
</script>
