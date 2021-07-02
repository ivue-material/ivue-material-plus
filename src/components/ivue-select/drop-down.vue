<template>
    <div
        class="ivue-select-dropdown"
        :class="className"
        :style="{
              minWidth: minWidth
         }"
    >
        <slot></slot>
    </div>
</template>

<script lang='ts'>
import { defineComponent, computed, reactive, onMounted, inject } from 'vue';

import { getStyle } from '../../utils/assist';

const prefixCls = 'ivue-select-dropdown';

export default defineComponent({
    name: prefixCls,
    props: {
        /**
         * 外层样式
         *
         * @type {String}
         */
        className: {
            type: String,
        },
    },
    setup() {
        // inject
        const select: any = inject('ivue-select');

        // data
        const data: any = reactive<{
            width: string;
        }>({
            /**
             * 是否显示菜单
             *
             * @type {String}
             */
            width: '',
        });

        // computed
        const styles = computed(() => {
            let style: any = {};

            if (data.width) {
                style.minWidth = `${data.width}px`;
            }

            return style;
        });

        const minWidth = computed(
            () => `${getStyle(select.selectWrapper, 'width')}`
        );

        // methdos

        // 更新数据
        //   const update = () => {
        //       // 设置输入框的宽度为100％
        //       if (parent.proxy.$options.name === 'ivue-select') {
        //           data.width = parseInt(getStyle(parent.proxy.$el, 'width'));
        //       }
        //   };

        // onMounted
        onMounted(() => {
            // update();
        });

        return {
            // data
            data,

            // computed
            styles,
            minWidth,
        };
    },
});
</script>
