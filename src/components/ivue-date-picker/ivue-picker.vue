<script lang='ts'>
import {
    defineComponent,
    reactive,
    computed,
    nextTick,
    onMounted,
    onBeforeUnmount,
    provide,
    watch,
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

        return () =>
            h(
                'div',
                {
                    class: prefixCls,
                },
                [slots.title()]
            );
    },
});
</script>
