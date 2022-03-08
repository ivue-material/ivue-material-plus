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
import IvuePicker from './ivue-picker.vue';

export default defineComponent({
    name: 'ivue-date-picker',
    mixins: [Colorable],
    props: {
        /**
         * 日历方向
         *
         * @type {Boolean}
         */
        landscape: Boolean,
        /**
         * 头部颜色
         *
         * @type {String}
         */
        headerColor: String,
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
        /**
         * 强制100％宽度
         *
         * @type {Boolean}
         */
        fullWidth: Boolean,
        /**
         * 隐藏日历头部
         *
         * @type {Boolean}
         */
        noTitle: Boolean,
    },
    setup(props: any, { emit }) {
        // 支持访问内部组件实例
        const vm = getCurrentInstance();

        return () =>
            h(
                IvuePicker,
                {},
                {
                    title: () => h('div', {}, 'ccqwdc'),
                }
            );
    },
});
</script>
