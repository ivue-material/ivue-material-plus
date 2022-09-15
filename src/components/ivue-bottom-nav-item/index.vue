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
import IvueButton from '../../components/ivue-button/index.vue';
import Colorable from '../../utils/mixins/colorable';
import { BottomNavContextKey } from './bottom-nav-item';

import {
    defineComponent,
    inject,
    getCurrentInstance,
    reactive,
    ComponentInternalInstance,
    onMounted,
    onUnmounted,
} from 'vue';

const prefixCls = 'ivue-bottom-nav-item';

export default defineComponent({
    name: prefixCls,
    mixins: [Colorable],
    props: {
        /**
         * 当前下标
         *
         * @type {Number, string}
         */
        name: {
            type: [Number, String],
            required: true,
        },
    },
    setup(props: any) {
        // 支持访问内部组件实例
        const { proxy, uid } =
            getCurrentInstance() as ComponentInternalInstance;

        // inject
        const { addItem, removeItem, updateValue } =
            inject(BottomNavContextKey);

        // data
        const data = reactive<{
            isActive: boolean;
            uid: number;
        }>({
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
            addItem(proxy);
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
