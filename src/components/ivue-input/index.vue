<template>
    <div :class="wrapClasses">
        <template v-if="type !== 'textarea'"> </template>
        <template v-else> </template>
    </div>
</template>

<script>
const prefixCls = 'ivue-input';
import { oneOf } from '../../utils/assist';

import {
    computed,
    defineComponent,
} from 'vue';

export default defineComponent({
    name: prefixCls,
    props: {
        /*
        * 输入框类型，可选值为 text、password、textarea、url、email、date
        *
        * @type {null}
        */
        type: {
            validator (value) {
                return oneOf(value, ['text', 'textarea', 'password', 'url', 'email', 'date', 'hidden']);
            },
            default: 'text'
        },
    },
    setup (props, { }) {

        const wrapClasses = computed(() => {
            return [
                `${prefixCls}-wrapper`
            ]
        })


        return {
            wrapClasses
        }
    }
})
</script>
