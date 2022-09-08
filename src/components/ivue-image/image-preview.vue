<template>
    <teleport to="body" :disabled="!transfer">
        <transition name="fade">
            <div :class="`${prefixCls}-mask`" :style="maskStyle" v-if="modelValue"></div>
        </transition>
    </teleport>
</template>

<script lang='ts'>
import { computed, defineComponent, getCurrentInstance, reactive } from 'vue';
import { transferIndex, transferIncrease } from '../../utils/transfer-queue';

const prefixCls = 'ivue-image-preview';

export default defineComponent({
    name: prefixCls,
    props: {
        /**
         * 是否显示，可使用 v-model 双向绑定
         *
         * @type {Boolean}
         */
        modelValue: {
            type: Boolean,
            default: false,
        },
        /**
         * 是否将弹层放置于 body 内
         *
         * @type {Boolean}
         */
        transfer: {
            type: Boolean,
            default() {
                const global =
                    getCurrentInstance().appContext.config.globalProperties;

                return !global.$IVUE || global.$IVUE.transfer === ''
                    ? false
                    : global.$IVUE.transfer;
            },
        },
    },
    setup() {
        // computed

        // 蒙版样式
        const maskStyle = computed(() => {
            return {
                zIndex: data.maskIndex + 1000,
            };
        });

        // methods

        // 蒙版index
        const getMaskIndex = () => {
            transferIncrease();

            return transferIndex;
        };

        // data
        const data: any = reactive<{
            maskIndex: number;
        }>({
            maskIndex: getMaskIndex(),
        });

        return {
            prefixCls,

            // data
            data,

            // computed
            maskStyle,
        };
    },
});
</script>
