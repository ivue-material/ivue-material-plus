<template>
    <span :class="wrapperClasses" :style="wrapperStyles" ref="wrapper">
        <!-- 图片 -->
        <slot name="img">
            <img :class="`${prefixCls}-img`" v-if="src" :src="src" @error="handleImageError" />
        </slot>
        <!-- icon -->
        <slot name="icon">
            <ivue-icon v-if="icon">{{ icon }}</ivue-icon>
        </slot>
        <!-- text -->
        <span :class="`${prefixCls}-text`" :style="slotStyles" ref="text" v-if="$slots.default">
            <slot></slot>
        </span>
    </span>
</template>

<script lang='ts'>
import {
    defineComponent,
    computed,
    getCurrentInstance,
    onMounted,
    reactive,
    ref,
    watch,
    nextTick,
    onUpdated,
} from 'vue';
import Colorable from '../../utils/mixins/colorable';
import { oneOf } from '../../utils/assist';
import IvueIcon from '../ivue-icon/index.vue';

// types
import type { Props, Data, _ComponentInternalInstance } from './avatar';

const prefixCls = 'ivue-avatar';

export default defineComponent({
    name: prefixCls,
    mixins: [Colorable],
    emits: ['on-error'],
    props: {
        /**
         * 类型
         *
         * @type {String}
         */
        shape: {
            validator(value: string) {
                return oneOf(value, ['circle', 'square']);
            },
            default: 'circle',
        },
        /**
         * 链接
         *
         * @type {String}
         */
        src: {
            type: String,
            default: '',
        },
        /**
         * 图标
         *
         * @type {String}
         */
        icon: {
            type: String,
            default: '',
        },
        /**
         * 大小
         *
         * @type {Number,String}
         */
        size: {
            type: [Number, String],
        },
    },
    setup(props: Props, { emit, slots }) {
        // 当前实例
        const { proxy } = getCurrentInstance() as _ComponentInternalInstance;

        // dom
        const text = ref<HTMLDivElement>();
        const wrapper = ref<HTMLDivElement>();

        // data
        const data = reactive<Data>({
            /**
             * 是否显示slot
             *
             * @type {Boolean}
             */
            isSlotShow: false,
            /**
             * slot缩放大小
             *
             * @type {Number}
             */
            slotScale: 1,
            /**
             * slot宽度
             *
             * @type {String}
             */
            slotWidth: 0,
        });

        // computed

        // 外层样式
        const wrapperClasses = computed(() => {
            const _class = proxy.setBackgroundColor(props.color).class;

            return [
                prefixCls,
                _class,
                {
                    [`${prefixCls}-${props.shape}`]: true,
                },
            ];
        });

        // 外层样式
        const wrapperStyles = computed(() => {
            const _style = proxy.setBackgroundColor(props.color).style;

            // 大小
            let sizeStyle = {};

            // 是否有大小
            if (props.size) {
                const regexp = new RegExp(/[a-zA-Z]/g);

                // 是否有单位
                const isUnit = regexp.test(`${props.size}`);

                const size = !isUnit ? `${props.size}px` : props.size;

                // 样式
                sizeStyle = {
                    height: size,
                    width: size,
                    lineHeight: size,
                };
            }

            return [sizeStyle, _style];
        });

        // slot样式
        const slotStyles = computed(() => {
            let style = {};

            if (data.isSlotShow) {
                style = {
                    position: 'absolute',
                    transform: `scale(${data.slotScale})`,
                    display: 'inline-block',
                    left: `calc(50% - ${Math.round(data.slotWidth / 2)}px)`,
                };
            }

            return style;
        });

        // methods

        // 图片加载错误
        const handleImageError = (event: Event) => {
            emit('on-error', event);
        };

        // 文字缩放
        const setTextScale = () => {
            data.isSlotShow =
                !props.src && !props.icon && !slots.src && !slots.icon;

            // 有默认插槽
            if (text.value) {
                // 获取slot宽度
                data.slotWidth = text.value.offsetWidth;
                // 获取父级宽度
                const fatherWidth = wrapper.value.getBoundingClientRect().width;

                // 计算缩放大小
                if (fatherWidth - 8 < data.slotWidth) {
                    data.slotScale = (fatherWidth - 8) / data.slotWidth;
                } else {
                    data.slotScale = 1;
                }
            }
        };

        // watch

        // 监听大小
        watch(
            () => props.size,
            () => {
                nextTick(() => {
                    setTextScale();
                });
            }
        );

        // onMounted
        onMounted(() => {
            // 文字缩放
            setTextScale();
        });

        // onUpdated
        onUpdated(() => {
            const slot = slots.default ? slots.default() : null;

            if (slot) {
                // 文字缩放
                setTextScale();
            }
        });

        return {
            prefixCls,
            // dom
            text,
            wrapper,
            // data
            data,
            // computed
            wrapperClasses,
            wrapperStyles,
            slotStyles,

            // methods
            handleImageError,
        };
    },
    components: {
        IvueIcon,
    },
});
</script>
