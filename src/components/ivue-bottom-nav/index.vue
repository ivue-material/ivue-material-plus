<script lang="ts">
import {
    defineComponent,
    h,
    reactive,
    computed,
    onMounted,
    nextTick,
    getCurrentInstance,
    watch,
    provide,
} from 'vue';

import Colorable from '../../utils/mixins/colorable';

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
         * 导航栏 position
         *
         * @type {String}
         */
        position: {
            type: String,
            default: null,
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
        // 支持访问内部组件实例
        const { proxy }: any = getCurrentInstance();

        // data
        const data: any = reactive<{
            buttons: Array<any>;
            listeners: Array<any>;
            ivueSyncRoute: boolean;
            isDestroying: boolean;
        }>({
            // 按钮导航数组
            buttons: [],
            // 监听事件列表
            listeners: [],
            // 判断是否是路由按钮
            // isRouteButton: [],
            // 是否开启监听导航路由
            ivueSyncRoute: false,
            // 是否正在销毁
            isDestroying: false,
        });

        // computed

        // class
        const classes = computed(() => {
            return {
                [`${prefixCls}--absolute`]: props.position === 'absolute',
                // 控制可见性
                [`${prefixCls}--active`]: props.visible,
                [`${prefixCls}--fixed`]: props.position === 'fixed',
                [`${prefixCls}--shift`]: props.shift,
                // [`${prefixCls}--is-color`]: props.color !== '',
            };
        });

        // 实时计算高度
        const computedHeight = computed(() => {
            return parseInt(props.height);
        });

        // methods

        // 更新数据
        const update = () => {
            for (let i = 0; i < data.buttons.length; i++) {
                const button = data.buttons[i];

                // 记录选择项
                if (isSelected(i)) {
                    button.data.isActive = true;
                } else {
                    button.data.isActive = false;
                }

                // 判断 to 开始监听路由
                if (button.to) {
                    data.ivueSyncRoute = true;
                }
            }
        };

        // 更新当前激活的导航
        const updateValue = (value) => {
            // updated v-model
            emit('update:modelValue', value);
        };

        // 获取button index
        const getValue = (i) => {
            if (data.buttons[i].name != null) {
                return data.buttons[i].name;
            }

            return i;
        };

        // 判断是否选中
        const isSelected = (i) => {
            const index = getValue(i);

            return props.modelValue === index;
        };

        // 判断路由激活导航
        const setActiveItemByRoute = () => {
            if (proxy.$router) {
                for (let i = 0; i < data.buttons.length; i++) {
                    const button = data.buttons[i];

                    if (
                        button.to ===
                        (proxy.$router.path ||
                            proxy.$router.currentRoute.value.fullPath)
                    ) {
                        button.$data.isActive = true;
                    } else {
                        button.$data.isActive = false;
                    }
                }
            }
        };

        // 设置watch深度监听router
        const setupWatchers = () => {
            // 监听路由变化
            if (data.ivueSyncRoute) {
                watch(
                    () => proxy.$route,
                    () => {
                        if (data.ivueSyncRoute) {
                            // 判断路由激活导航
                            setActiveItemByRoute();
                        }
                    },
                    {
                        deep: true,
                    }
                );
            }
        };

        // 提供参数给注入 buttonGroup 的子组件
        const register = (index) => {
            // 更新当前激活的导航
            updateValue(index);
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
            () => data.buttons,
            () => {
                // 初始化
                update();
            }
        );

        // provide
        provide('buttonGroup', {
            register,
            buttons: data.buttons,
            modelValue: props.modelValue,
        });

        // onMounted
        onMounted(() => {
            // 初始化
            update();

            nextTick(() => {
                // 是否开启监听导航路由
                if (data.ivueSyncRoute) {
                    // 判断路由激活导航
                    setActiveItemByRoute();
                }

                // 设置watch深度监听router
                window.setTimeout(() => {
                    setupWatchers();
                }, 100);
            });
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
            this.$slots && this.$slots?.default?.()
        );
    },
});
</script>
