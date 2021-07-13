<template>
    <div :class="wrapClasses" :style="wrapStyle">
        <!-- 下划线 -->
        <div :class="[`${prefixCls}-divider`]">
            <i></i>
        </div>
        <!-- 步骤 -->
        <div :class="[`${prefixCls}-header`]">
            <div :class="[`${prefixCls}-header-content`]">
                <!-- 步骤数 还没完成或者没有错误显示-->
                <span
                    v-if="!icon && !$slots.icon && data.currentStatus !== 'finish' && data.currentStatus !== 'error'"
                >{{ data.stepNumber }}</span>
                <!-- 插槽 -->
                <span v-else-if="$slots.icon" :class="`${prefixCls}s-icon`">
                    <slot name="icon"></slot>
                </span>
                <!-- 图标 -->
                <ivue-icon
                    :class="`${prefixCls}-icon`"
                    v-else
                >{{icon ? icon : data.currentStatus === 'finish' ? 'check' : data.currentStatus === 'error'? 'close': ''}}</ivue-icon>
            </div>
        </div>
    </div>
</template>

<script lang='ts'>
import {
    defineComponent,
    computed,
    reactive,
    inject,
    onMounted,
    getCurrentInstance,
    onBeforeUnmount,
} from 'vue';

import { oneOf } from '../../utils/assist';

import IvueIcon from '../ivue-icon/index.vue';

const prefixCls = 'ivue-step';

export default defineComponent({
    name: prefixCls,
    props: {
        /**
         * 当前步骤的状态
         *
         * @type {String}
         */
        status: {
            validator(value: string) {
                return oneOf(value, ['wait', 'process', 'finish', 'error']);
            },
        },
        /**
         * 步骤图标
         *
         * @type {String}
         */
        icon: {
            type: String,
        },
    },
    setup(props: any, { slots }) {
        // inject
        const steps: any = inject('ivue-steps');

        // options
        const options = steps.data.options;

        // vm
        const { uid }: any = getCurrentInstance();

        // data
        const data = reactive<{
            stepNumber: string;
            currentStatus: string;
            nextError: boolean;
            index: number;
        }>({
            /**
             * 步骤数
             *
             * @type {String}
             */
            stepNumber: '',
            /**
             * 当前状态
             *
             * @type {String}
             */
            currentStatus: props.status,
            /**
             * 下一个错误状态
             *
             * @type {Boolean}
             */
            nextError: false,
            /**
             * 初始化下标
             *
             * @type {Number}
             */
            index: 0,
        });

        // computed

        // 外层class
        const wrapClasses = computed(() => {
            return [
                `${prefixCls}-item`,
                `${prefixCls}-status-${data.currentStatus}`,
                {
                    [`${prefixCls}-custom`]: props.icon || slots.icon,
                    [`${prefixCls}-next-error`]: data.nextError,
                },
            ];
        });

        // 进行居中对齐
        const isCenter = computed(() => {
            return steps.props.alignCenter;
        });

        // 是否竖向
        const isVertical = computed(() => {
            return steps.props.direction === 'vertical';
        });

        const isLast = computed(() => {
            return options[stepsCount.value - 1]?.uid === uid;
        });

        // 进度总长度
        const stepsCount = computed(() => {
            return options.length;
        });

        // 外层样式
        const wrapStyle = computed(() => {
            const space = steps.props.space;

            const style: Record<string, unknown> = {
                flexBasis:
                    typeof space === 'number'
                        ? `${space}px`
                        : space
                            ? space
                            : `${
                                100 / (options.length - (isCenter.value ? 0 : 1))
                            }%`,
            };

            // 竖向
            if (isVertical.value) {
                return style;
            }

            // 是否是最后一个元素
            if (isLast.value) {
                style.maxWidth = 100 / stepsCount.value + '%';
            }

            return style;
        });

        // onBeforeUnmount
        onBeforeUnmount(() => {
            // 销毁选项
            steps.onOptionDestroy(data.index);
        });

        const stepItemState = reactive({
            uid: uid,
            data: data,
        });

        options.push(stepItemState);

        return {
            prefixCls,

            // data
            data,

            // computed
            wrapClasses,
            wrapStyle,
        };
    },
    components: {
        IvueIcon,
    },
});
</script>
