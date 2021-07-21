<template>
    <div :class="classes" :style="styles">
        <notice></notice>
    </div>
</template>

<script lang='ts'>
import { defineComponent, computed } from 'vue';
import Notice from './notice.vue';

const prefixCls = 'ivue-notification';

export default defineComponent({
    props: {
        /**
         * 样式名称
         *
         * @type {String}
         */
        prefixCls: {
            type: String,
            default: prefixCls
        },
        /**
         * 外部样式
         *
         * @type {String}
         */
        styles: {
            type: Object,
            default: function () {
                return {
                    top: '65px',
                    left: '50%'
                };
            }
        },
        content: {
            type: String,
            default: ''
        },
        /**
         * 样式名称
         *
         * @type {String}
         */
        className: {
            type: String
        }
    },
    setup(props: any) {

        // computed

        // 外层样式
        const classes = computed(() => {
            return [
                props.prefixCls,
                {
                    [`${props.className}`]: props.className
                }
            ];
        });

        return {
            // computed
            classes
        };
    },
    components: {
        Notice
    }
});
</script>
