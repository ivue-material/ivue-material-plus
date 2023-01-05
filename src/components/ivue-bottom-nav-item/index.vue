<template>
    <div :class="prefixCls">
        <ivue-button
            flat
            :color="color"
            :index="name"
            :isActive="data.isActive"
            @click="handleClick"
        >
            <slot></slot>
        </ivue-button>
    </div>
</template>

<script lang="ts">
import {
    defineComponent,
    inject,
    getCurrentInstance,
    reactive,
    ComponentInternalInstance,
    onMounted,
    onUnmounted,
} from 'vue';

import IvueButton from '../../components/ivue-button/index.vue';

// type
import { BottomNavContextKey, Props, Data, BottomNavItemInstance } from './types/bottom-nav-item';

const prefixCls = 'ivue-bottom-nav-item';

export default defineComponent({
    name: prefixCls,
    props: {
        /**
         * 当前下标
         *
         * @type {Number, String}
         */
        name: {
            type: [Number, String],
            required: true,
        },
        /**
         * 颜色
         *
         * @type {String | Array}
         */
        color: {
            type: [String, Array],
            default: '',
        },
    },
    setup(props: Props) {
        // 支持访问内部组件实例
        const { proxy, uid } =
            getCurrentInstance() as ComponentInternalInstance;

        // inject
        const { addItem, removeItem, updateValue } =
            inject(BottomNavContextKey);

        // data
        const data = reactive<Data>({
            /**
             * 按钮是否激活状态
             *
             * @type {Boolean}
             */
            isActive: false,
            /**
             * uid
             *
             * @type {Number}
             */
            uid: uid,
        });

        // methods

        // 点击选项
        const handleClick = () => {
            updateValue(props.name);
        };

        // onMounted
        onMounted(() => {
            addItem(proxy as BottomNavItemInstance);
        });

        // onUnmounted
        onUnmounted(() => {
            removeItem(uid);
        });

        return {
            prefixCls,

            // data
            data,

            // methods
            handleClick,
        };
    },
    components: {
        IvueButton,
    },
});
</script>
