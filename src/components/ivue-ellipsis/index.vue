<template>
    <div :class="prefixCls">
        <template v-if="data.computedReady">
            <span :class="`${prefixCls}-text`" ref="textRef">{{ data.computedText }}</span>
            <span :class="`${prefixCls}-more`">
                <slot name="more">...</slot>
            </span>
        </template>
    </div>
</template>

<script lang="ts">
import { nextTick } from 'process';
import {
    defineComponent,
    getCurrentInstance,
    onMounted,
    reactive,
    ref,
    watch,
} from 'vue';
import { getStyle } from '../../utils/assist';

const prefixCls = 'ivue-ellipsis';

/* eslint-disable */
export default defineComponent({
    name: prefixCls,
    emits: ['on-hide', 'on-show'],
    props: {
        /**
         * 文本
         *
         * @type {String}
         */
        text: {
            type: String,
        },
        /**
         * 按照指定长度截取
         *
         * @type {Number}
         */
        length: {
            type: Number,
        },
        /**
         * 限制的高度
         *
         * @type {Number}
         */
        height: {
            type: Number,
        },
        /**
         * 是否禁用省略
         *
         * @type {Boolean}
         */
        disabled: {
            type: Boolean,
            default: false,
        },
        /**
         * 限制行数，将换算为 height。如果设置了 height，则直接使用 height 计算
         *
         * @type {Number}
         */
        lines: {
            type: Number,
        },
        /**
         * 是否将全角字符的长度视为2来计算字符串长度，适用于 length
         *
         * @type {Boolean}
         */
        fullWidthRecognition: {
            type: Boolean,
            default: false,
        },
    },
    setup(props, { emit }) {
        // vm
        const { proxy } = getCurrentInstance();

        // dom
        const textRef = ref<HTMLSpanElement>();

        // data
        const data = reactive<{
            computedReady: boolean;
            computedText: string;
            oversize: boolean;
        }>({
            /**
             * 先隐形计算，计算好后，再根据配置显示
             *
             * @type {Boolean}
             */
            computedReady: false,
            /**
             * 计算后显示的text
             *
             * @type {String}
             */
            computedText: '',
            /**
             * 超出长度
             *
             * @type {Boolean}
             */
            oversize: false,
        });

        // methods

        // 初始化
        const init = () => {
            // 计算显示的text
            setShowText();
            // 超出显示
            limitShow();
        };

        // 计算显示的text
        const setShowText = () => {
            // 初始化状态
            data.oversize = false;
            data.computedReady = false;

            nextTick(() => {
                let $el = proxy.$el;

                // 限制的高度
                let height = props.height;

                let text = props.text;

                let n = 1000;

                // 当 height 未定义，且 lines 定义时，计算真实高度，否则使用 this.height
                if (!props.height && props.lines) {
                    const lineHeight = parseInt(
                        getStyle($el, 'lineHeight'),
                        10
                    );

                    // 行高 * 限制行数
                    height = lineHeight * props.lines;

                    console.log('height', height);
                }

                // 有textRef
                // 指定 length，则按具体字数剪裁
                if (props.length) {
                    const textLength = props.fullWidthRecognition
                        ? getStrFullLength(props.text)
                        : props.text.length;

                    // 超出指定长度截取
                    if (textLength > props.length) {
                        // 超出长度
                        data.oversize = true;

                        // 计算后显示的text
                        data.computedText = props.fullWidthRecognition
                            ? cutStrLength(props.text, props.length)
                            : props.text.slice(0, props.length);
                    }
                }
                // 指定高度
                else {
                    if ($el.offsetHeight > height) {
                        data.oversize = true;

                        // while ($el.offsetHeight > height && n > 0) {
                        //     // 外层高度 > 限制的高度 * 3
                        //     if ($el.offsetHeight > height * 3) {
                        //         data.computedText = props.text.substring(
                        //             0,
                        //             Math.floor(props.text.length / 2)
                        //         );
                        //     } else {
                        //         data.computedText = props.text.substring(
                        //             0,
                        //             props.text.length - 1
                        //         );
                        //     }

                        //     n--;
                        // }

                        console.log('///', $el.offsetHeight > height * 3);
                    }
                }
            });
        };

        // 超出显示
        const limitShow = () => {
            if (!props.length) {
                data.computedReady = true;
                data.computedText = props.text;
            }

            nextTick(() => {
                let $el = proxy.$el;

                // 文本省略的时候触发
                if ($el.offsetHeight > props.height) {
                    emit('on-hide');
                }
                // 文本全部展示的时候触发
                else {
                    emit('on-show');
                }
            });
        };

        // 获取字符串全部长度
        const getStrFullLength = (str: string = '') => {
            str.split('').reduce((pre, cur) => {
                // 字符在字符串中的下标->第一个
                const charCode = cur.charCodeAt(0);

                // 前 128 ASCII 字符编码
                if (charCode >= 0 && charCode <= 128) {
                    return pre + 1;
                }

                return pre + 2;
            });
        };

        // 切割字符串
        const cutStrLength = (str: string = '', maxLength: number) => {
            let showLength = 0;

            return str.split('').reduce((pre, cur) => {
                // 字符在字符串中的下标->第一个
                const charCode = cur.charCodeAt(0);

                // 前 128 ASCII 字符编码
                if (charCode >= 0 && charCode <= 128) {
                    showLength += 1;
                }
                // 不是前 128 ASCII 字符编码
                else {
                    showLength += 2;
                }

                // 设置长度
                if (showLength <= maxLength) {
                    return pre + cur;
                }

                return pre;
            }, '');
        };

        // watch

        // 监听计算后显示的text
        watch(
            () => data.computedText,
            (value) => {
                if (value) {
                    data.computedReady = true;
                }
            }
        );

        // onMounted
        onMounted(() => {
            init();
        });

        return {
            prefixCls,
            // dom
            textRef,

            // data
            data,
        };
    },
});
</script>
