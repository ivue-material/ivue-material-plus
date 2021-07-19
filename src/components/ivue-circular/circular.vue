<template>
    <div :class="wrapClasses" :style="wrapStyles">
    </div>
</template>

<script>
import { computed, defineComponent,} from 'vue';

const prefixCls = 'ivue-circular';

export default defineComponent({
    name: prefixCls,
    setup() {

        // 外层样式
        const wrapClasses = computed(() => {
            return prefixCls;
        });


        return {
            // compile
            wrapClasses
        };
    }
});
</script>
