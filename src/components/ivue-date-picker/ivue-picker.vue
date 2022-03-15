<script lang='ts'>
import {
    defineComponent,
    reactive,
    computed,
    nextTick,
    onMounted,
    onBeforeUnmount,
    provide,
    Transition,
    TransitionGroup,
    h,
    getCurrentInstance,
} from 'vue';

import Colorable from '../../utils/mixins/colorable';

const prefixCls = 'ivue-picker';

export default defineComponent({
    name: prefixCls,
    mixins: [Colorable],
    props: {
        /**
         * 强制100％宽度
         *
         * @type {Boolean}
         */
        fullWidth: Boolean,
        /**
         * 选择框宽度
         *
         * @type {Boolean}
         */
        width: {
            type: [Number, String],
            default: 290,
            validator: (value: any) => parseInt(value, 10) > 0,
        },
        transition: {
            type: String,
            default: 'ivue-picker-fade',
        },
        /**
         * 日历方向
         *
         * @type {Boolean}
         */
        landscape: Boolean,
    },
    setup(props: any, { slots }) {
        // methods
        // 支持访问内部组件实例
        const { proxy }: any = getCurrentInstance();

        // 渲染标题
        const genTitle = () => {
            return h(
                'div',
                proxy.setBackgroundColor(props.color || 'primary', {
                    class: {
                        [`${prefixCls}-title`]: true,
                        [`${prefixCls}-title--landscape`]: proxy.landscape,
                    },
                }),
                slots.title()
            );
        };

        // 渲染日期选择body 动画
        const genBodyTransition = () => {
            return h(
                Transition,
                {
                    name: props.transition,
                },
                {
                    default: () => slots.default()
                }
            );
        };

        // 渲染日期选择body
        const genBody = () => {
            return h(
                'div',
                {
                    class: 'ivue-picker-body',
                    style: props.fullWidth
                        ? undefined
                        : {
                              width: `${props.width}px`,
                          },
                },
                [genBodyTransition()]
            );
        };

        return () =>
            h(
                'div',
                {
                    class: {
                        [`${prefixCls} ivue-card`]: true,
                        [`${prefixCls}--landscape`]: props.landscape,
                    },
                    style: props.fullWidth
                        ? { display: 'block' }
                        : { display: 'inline-flex' },
                },
                [
                    // 标题
                    slots.title ? genTitle() : null,
                    // body
                    genBody(),
                ]
            );
    },
});
</script>
