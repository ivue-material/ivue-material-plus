<template>
    <transition :name="transitionName" @enter="handleEnter" @leave="handleLeave" appear>
        <div :class="classes" :style="styles"></div>
    </transition>
</template>

<script lang='ts'>
import { defineComponent, computed, reactive } from 'vue';

export default defineComponent({
    props: {
        /**
         * 样式名称
         *
         * @type {String}
         */
        prefixCls: {
            type: String,
            default: '',
        },
        /**
         * 动画名称
         *
         * @type {String}
         */
        transitionName: {
            type: String,
        },
        /**
         * 类型名称
         *
         * @type {String}
         */
        type: {
            type: String,
        },
        /**
         * 样式名称
         *
         * @type {String}
         */
        className: {
            type: String,
        },
        /**
         * 是否有关闭按钮
         *
         * @type {Boolean}
         */
        closable: {
            type: Boolean,
            default: false,
        },
    },
    setup(props: any) {
        // data
        const data: any = reactive<{
            haveDesc: boolean;
        }>({
            haveDesc: false,
        });

        // computed

        // 原始class
        const baseClass = computed(() => {
            return `${props.prefixCls}-notice`;
        });

        // 外层样式
        const classes = computed(() => {
            const _baseClass = baseClass.value;

            return [
                baseClass.value,
                {
                    [`${props.className}`]: !!props.className,
                    [`${_baseClass}-closable`]: props.closable,
                    [`${_baseClass}-with-desc`]: this.withDesc,
                    [`${_baseClass}-with-background`]: this.background,
                },
            ];
        });

        // methods

        // 动画 enter
        const handleEnter = (el) => {
            if (props.type === 'message') {
                el.style.height = `${el.scrollHeight}px`;
            }
        };

        // 动画 leave
        const handleLeave = (el) => {
            if (props.type === 'message') {
                //如果当前只有一个 Message，则不使用 js 过渡动画
                if (
                    document.getElementsByClassName('ivue-message-notice')
                        .length !== 1
                ) {
                    el.style.height = 0;
                    el.style.paddingTop = 0;
                    el.style.paddingBottom = 0;
                }
            }
        };

        return {
            // data
            data,

            // computed
            classes,

            // methods
            handleEnter,
            handleLeave,
        };
    },
});
</script>
