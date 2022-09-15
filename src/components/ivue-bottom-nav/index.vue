<script lang="ts">
import {
    defineComponent,
    h,
    reactive,
    computed,
    onMounted,
    watch,
    provide,
} from 'vue';

import Colorable from '../../utils/mixins/colorable';
import { oneOf } from '../../utils/assist';

// ts
import { BottomNavContextKey } from '../ivue-bottom-nav-item/bottom-nav-item';
import { BottomNavItemContext } from './bottom-nav';

const prefixCls = 'ivue-bottom-nav';

export default defineComponent({
    name: prefixCls,
    mixins: [Colorable],
    // 声明事件
    emits: ['update:modelValue', 'on-change'],
    props: {
        /**
         * 当前激活的导航
         *
         * @type {Number, String}
         */
        modelValue: {
            type: [Number, String],
            default: null,
        },
        /**
         * 设置组件高度
         *
         * @type {Number, String}
         */
        height: {
            type: [Number, String],
            default: 56,
            validator: (value: any) => {
                return !isNaN(parseInt(value));
            },
        },
        /**
         * 是否隐藏
         *
         * @type {Boolean}
         */
        visible: {
            type: Boolean,
            default: true,
        },
        /**
         * 导航栏固定位置
         *
         * @type {String}
         */
        position: {
            type: String,
            validator(value: string) {
                return oneOf(value, ['fixed', 'absolute']);
            },
        },
        /**
         * 不是激活状态时隐藏按钮上的文字
         *
         * @type {Boolean}
         */
        shift: {
            type: Boolean,
            default: false,
        },
    },
    setup(props: any, { emit }) {
        // data
        const data: any = reactive<{
            items: Array<BottomNavItemContext>;
        }>({
            // 导航数组
            items: [],
        });

        // computed

        // class
        const classes = computed(() => {
            return {
                // 导航栏固定位置 position
                [`${prefixCls}--absolute`]: props.position === 'absolute',
                // 导航栏固定位置 fixed
                [`${prefixCls}--fixed`]: props.position === 'fixed',
                // 控制可见性
                [`${prefixCls}--active`]: props.visible,
                // 不是激活状态时隐藏按钮上的文字
                [`${prefixCls}--shift`]: props.shift,
            };
        });

        // 实时计算高度
        const computedHeight = computed(() => {
            return parseInt(props.height);
        });

        // methods

        // 更新数据
        const update = () => {
            for (let i = 0; i < data.items.length; i++) {
                const button = data.items[i];

                // 记录选择项

                // 激活
                if (isSelected(i)) {
                    button.data.isActive = true;
                }
                // 没有激活
                else {
                    button.data.isActive = false;
                }
            }
        };

        // 更新当前激活的导航
        const updateValue = (value: number | string) => {
            // updated v-model
            emit('update:modelValue', value);
        };

        // 获取button index
        const getValue = (i: number) => {
            if (data.items[i].name != null) {
                return data.items[i].name;
            }

            return i;
        };

        // 判断是否选中
        const isSelected = (i: number) => {
            const index = getValue(i);

            return props.modelValue === index;
        };

        // 添加选项
        const addItem = (item: BottomNavItemContext) => {
            data.items.push(item);
        };

        // 删除选项
        const removeItem = (uid?: number) => {
            const index = data.items.findIndex((item) => item.uid === uid);

            // 删除
            if (index !== -1) {
                data.items.splice(index, 1);
            }
        };

        // watch

        // 监听变化
        watch(
            () => props.modelValue,
            (index) => {
                update();

                emit('on-change', index);
            }
        );

        // 监听按钮导航数组
        watch(
            () => data.items,
            () => {
                // 初始化
                update();
            }
        );

        // provide
        provide(BottomNavContextKey, {
            addItem,
            removeItem,
            updateValue,
        });

        // onMounted
        onMounted(() => {
            // 初始化
            update();
        });

        return {
            // data
            data,

            // computed
            classes,
            computedHeight,

            // methods
            updateValue,
        };
    },
    render() {
        return h(
            'div',
            this.setBackgroundColor(this.color, {
                class: {
                    [`${prefixCls}`]: true,
                    ...this.classes,
                },
                style: {
                    height: `${this.computedHeight}px`,
                },
            }),
            // 插槽
            this.$slots && this.$slots?.default?.()
        );
    },
});
</script>
