<template>
    <div :class="classes">
        <!-- 头部 -->
        <div :class="headerClasses" @click="handleToggle">
            <slot name="title">{{ title }}</slot>
            <!-- icon -->
            <slot name="header-icon" v-if="!hideArrow">
                <ivue-icon>keyboard_arrow_right</ivue-icon>
            </slot>
        </div>
        <!-- transition -->
        <collapse-transition v-if="data.mounted">
            <div :class="`${prefixCls}--content`" v-show="data.isActive">
                <div :class="`${prefixCls}--content-box`">
                    <slot name="content"></slot>
                </div>
            </div>
        </collapse-transition>
    </div>
</template>

<script lang='ts'>
import {
    defineComponent,
    reactive,
    computed,
    inject,
    getCurrentInstance,
    onMounted,
    onBeforeUnmount,
    ComponentInternalInstance,
} from 'vue';
import IvueIcon from '../ivue-icon/index.vue';
import CollapseTransition from '../../utils/collapse-transition';

// type
import { CascaderContextKey } from './collapse';
import { Data } from './panel';

const prefixCls = 'ivue-collapse-panel';

export default defineComponent({
    name: prefixCls,
    props: {
        /**
         * 标题
         *
         * @type {String}
         */
        title: {
            type: String,
            default: '',
        },
        /**
         * 用于设置激活 panel
         *
         * @type {String}
         */
        name: {
            type: String,
        },
        /**
         * 隐藏箭头
         *
         * @type {Boolean}
         */
        hideArrow: {
            type: Boolean,
            default: false,
        },
    },
    setup(props: any) {
        const IvueCollapse = inject(CascaderContextKey);

        // 支持访问内部组件实例
        const vm = getCurrentInstance() as ComponentInternalInstance;

        // data
        const data = reactive<Data>({
            /**
             * 是否激活
             *
             * @type Boolean
             */
            isActive: false,
            /**
             * 下标
             *
             * @type {Number}
             */
            index: 0,
            /**
             * 是否初始化完成
             *
             * @type {Boolean}
             */
            mounted: false,
        });

        // onMounted
        onMounted(() => {
            // 初始化完成
            data.mounted = true;

            IvueCollapse.pushExpandable(vm);
        });

        // onBeforeUnmount
        onBeforeUnmount(() => {
            IvueCollapse.removeExpandable(vm);
        });

        // computed

        // 外层样式
        const classes = computed(() => {
            return [
                `${prefixCls}`,
                {
                    [`${prefixCls}--active`]: data.isActive,
                },
            ];
        });

        // 头部 class
        const headerClasses = computed(() => {
            return [`${prefixCls}--header`];
        });

        // methods

        const handleToggle = () => {
            IvueCollapse.toggle({
                name: props.name || data.index,
                isActive: data.isActive,
            });
        };

        return {
            prefixCls,

            // data
            data,

            // computed
            classes,
            headerClasses,

            // methods
            handleToggle,
        };
    },
    components: {
        IvueIcon,
        CollapseTransition,
    },
});
</script>
