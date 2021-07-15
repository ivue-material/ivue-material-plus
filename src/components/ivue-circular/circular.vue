<template>
    <div :class="wrapClasses" :style="wrapStyles">
        <svg viewBox="0 0 100 100">
            <!-- 渐变 -->
            <defs v-if="showDefs">
                <linearGradient :id="id" x1="100%" y1="0%" x2="0%" y2="0%">
                    <stop offset="0%" :stop-color="strokeColor[0]" />
                    <stop offset="100%" :stop-color="strokeColor[1]" />
                </linearGradient>
            </defs>
            <!-- 路径 -->
            <path
                :d="pathString"
                :stroke="trailColor"
                :stroke-width="trailWidth"
                :fill-opacity="0"
                :style="trailStyle"
                :stroke-linecap="strokeLinecap"
            />

            <path
                :d="pathString"
                :stroke-linecap="strokeLinecap"
                :stroke="strokeValue"
                :stroke-width="computedStrokeWidth"
                fill-opacity="0"
                :style="pathStyle"
                :class="`${prefixCls}-overlay`"
            />
        </svg>
    </div>
</template>

<script>
import { defineComponent, computed, reactive } from 'vue';

import { oneOf } from '../../utils/assist';
import { getRandomStr } from '../../utils/helpers';

const prefixCls = 'ivue-circular';

export default defineComponent({
    name: prefixCls,
    props: {
        /**
         * 进度环的颜色
         *
         * @type {String | Array}
         */
        strokeColor: {
            type: [String, Array],
            default: '#5B8EFF',
        },
        /**
         * 状态，可选值为normal、active、wrong、success
         *
         * @type {String}
         */
        status: {
            validator(value) {
                return oneOf(value, ['normal', 'active', 'wrong', 'success']);
            },
            default: 'normal',
        },
        /**
         * 隐藏文字
         *
         * @type {Number}
         */
        hideText: {
            type: Boolean,
            default: false,
        },
        /**
         * 一个不确定的进度圆环永远循环动画
         *
         * @type {Boolean}
         */
        indeterminate: {
            type: Boolean,
            default: false,
        },
        /**
         * 圆圈大小，单位 px
         *
         * @type {Number}
         */
        size: {
            type: Number,
            default: 50,
        },
        /**
         * 是否显示为仪表盘
         *
         * @type {Boolean}
         */
        dashboard: {
            type: Boolean,
            default: false,
        },
        /**
         * 进度环的线宽，单位 px
         *
         * @type {Number}
         */
        strokeWidth: {
            type: Number,
            default: 6,
        },
        /**
         * 进度环背景的颜色
         *
         * @type {String}
         */
        trailColor: {
            type: String,
            default: '#F8F9FD',
        },
        /**
         * 进度环背景的线宽，单位 px
         *
         * @type {Number}
         */
        trailWidth: {
            type: Number,
            default: 6,
        },
        /**
         * 进度环顶端的形状，可选值为square（方）和round（圆）
         *
         * @type {String}
         */
        strokeLinecap: {
            validator(value) {
                return oneOf(value, ['square', 'round']);
            },
            default: 'round',
        },
        /**
         * 百分比
         *
         * @type {Number}
         */
        percent: {
            type: Number,
            default: 0,
        },
    },
    setup(props) {
        // data
        const data = reactive({
            /**
             * 当前进度条状态
             *
             * @type {String}
             */
            currentStatus: props.status,
            /**
             * id
             *
             * @type {String}
             */
            id: `${prefixCls}-${getRandomStr(3)}`,
        });

        // computed

        // 外层样式
        const wrapClasses = computed(() => {
            return [
                prefixCls,
                `${prefixCls}-${data.currentStatus}`,
                {
                    [`${prefixCls}-show-info`]: !props.hideText,
                    [`${prefixCls}-indeterminate`]: props.indeterminate,
                },
            ];
        });

        // 外层 style
        const wrapStyles = computed(() => {
            return {
                height: `${props.size}px`,
                width: `${props.size}px`,
            };
        });

        // 显示渐变
        const showDefs = computed(() => {
            return typeof props.strokeColor !== 'string';
        });

        // 半径
        const radius = computed(() => {
            return 50 - props.strokeWidth / 2;
        });

        // 路径
        const pathString = computed(() => {
            const _radius = radius.value;

            // 仪表盘
            if (props.dashboard) {
                return `M 50,50 m 0,${_radius} a ${_radius},${_radius} 0 1 1 0,-${
                    2 * _radius
                } a ${_radius},${_radius} 0 1 1 0,${2 * _radius}`;
            }
            // 普通渲染
            else {
                return `M 50,50 m 0,-${_radius} a ${_radius},${_radius} 0 1 1 0,${
                    2 * _radius
                } a ${_radius},${_radius} 0 1 1 0,-${2 * _radius}`;
            }
        });

        // 长度
        const len = computed(() => {
            return Math.PI * 2 * radius.value;
        });

        // 路径样式
        const trailStyle = computed(() => {
            let style = {};

            // 是否显示为仪表盘
            if (props.dashboard) {
                style = {
                    'stroke-dasharray': `${len.value - 75}px ${len.value}px`,
                    'stroke-dashoffset': `-${75 / 2}px`,
                    transition:
                        'stroke-dashoffset .3s ease 0s, stroke-dasharray .3s ease 0s, stroke .3s',
                };
            }

            return style;
        });

        // 路径值
        const strokeValue = computed(() => {
            let color = props.strokeColor;

            if (typeof props.strokeColor !== 'string') {
                color = `url(#${data.id})`;
            }

            return color;
        });

        // 计算渲染的路径进度
        const computedStrokeWidth = computed(() => {
            return props.percent === 0 && props.dashboard
                ? 0
                : props.strokeWidth;
        });

        // 渲染进度的路径样式
        const pathStyle = computed(() => {
            let style = {};

            // 是否显示为仪表盘
            if (props.dashboard) {
                style = {
                    'stroke-dasharray': `${
                        (props.percent / 100) * (len.value - 75)
                    }px ${len.value}px`,
                    'stroke-dashoffset': `-${75 / 2}px`,
                    transition:
                        'stroke-dashoffset .3s ease 0s, stroke-dasharray .6s ease 0s, stroke .6s, stroke-width .06s ease .6s',
                };
            }
            // 普通渲染
            else {
                style = {
                    'stroke-dasharray': `${len.value}px ${len.value}px`,
                    'stroke-dashoffset': `${
                        ((100 - props.percent) / 100) * len.value
                    }px`,
                    transition:
                        'stroke-dashoffset 0.6s ease 0s, stroke 0.6s ease',
                };
            }

            return style;
        });

        return {
            prefixCls,

            // data
            data,

            // computed
            wrapClasses,
            wrapStyles,
            showDefs,
            pathString,
            trailStyle,
            strokeValue,
            computedStrokeWidth,
            pathStyle,
        };
    },
});
</script>
