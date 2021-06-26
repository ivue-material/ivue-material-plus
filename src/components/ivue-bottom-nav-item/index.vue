<template>
    <div :class="classes">
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

import {
    defineComponent,
    inject,
    getCurrentInstance,
    reactive,
    computed
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
        const { proxy }: any = getCurrentInstance();

        // inject
        const buttonGroup: any = inject('buttonGroup');

        if (buttonGroup) {
            buttonGroup.buttons.push(proxy);
        }

        // data
        const data = reactive<{
            isActive: boolean;
        }>({
            /**
             * 按钮是否激活状态
             *
             * @type {Boolean}
             */
            isActive: false,
        });

        // computed

        // class
        const classes = computed(() => {
            return {
                [`${prefixCls}`]: true,
            };
        });

        // methods

        const handleClick = () => {
            // 激活数据
            if (buttonGroup) {
                buttonGroup.register(props.name);
            }
        };

        return {
            prefixCls,

            // data
            data,

            // computed
            classes,

            // inject
            buttonGroup,

            // methods
            handleClick,
        };
    },
    components: {
        IvueButton,
    },
});
</script>
