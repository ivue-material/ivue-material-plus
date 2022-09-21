<template>
    <div>122</div>
</template>

<script lang='ts'>
import { computed, defineComponent } from 'vue';

const prefixCls = 'ivue-back-top';

export default defineComponent({
    name: prefixCls,
    props: {
        bottom: {
            type: Number,
            default: 30,
        },
    },
    setup() {
        // computed

        const wrapperClasses = computed(() => {
            return [];
        });

        return {
            wrapperClasses,
        };
    },
});
</script>
