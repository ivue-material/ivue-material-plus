<template>
    <transition :name="`${prefixCls}-fade`">
        <!-- v-show="always || visible" -->
        <div :class="wrapperClass" @mousedown="handleThumbWrapperMousedown" ref="thumbWrapper">
            <div
                :class="`${prefixCls}-thumb`"
                :style="thumbStyle"
                @mousedown="handleThumbMousedown"
                ref="thumb"
            ></div>
        </div>
    </transition>
</template>

<script lang="ts">
import { computed, defineComponent, ref, reactive, inject } from 'vue';
import { on, off } from '../../utils/dom';

const prefixCls = 'ivue-scrollbar';

// 鼠标按下
let mousedown = false;

// 开始选择任意文本内容时触发
let originalOnSelectStart = document.onselectstart;

export default defineComponent({
    props: {
        /**
         * 偏移位置
         *
         * @type {Number}
         */
        moveX: {
            type: Number,
        },
        /**
         * x轴滚动比率
         *
         * @type {Number}
         */
        ratioX: {
            type: Number,
            default: 1,
        },
        /**
         * 滚动条总是显示
         *
         * @type {Boolean}
         */
        always: {
            type: Boolean,
            default: false,
        },
        /**
         * 滚动条宽度
         *
         * @type {String}
         */
        barWidth: {
            type: String,
            default: '',
        },
        /**
         * 方向
         *
         * @type {Boolean}
         */
        vertical: {
            type: Boolean,
            default: false,
        },
    },
    setup(props) {
        // IvueScrollbar
        const IvueScrollbar: any = inject(prefixCls);

        // dom
        const thumbWrapper = ref<HTMLDivElement>();
        const thumb = ref<HTMLDivElement>();

        // data
        const data: any = reactive<{
            thumbState: Partial<Record<'X' | 'Y', number>>;
        }>({
            /**
             * 状态
             *
             * @type {String}
             */
            thumbState: {},
        });

        // wrapperClass
        const wrapperClass = computed(() => {
            return [
                `${prefixCls}-bar`,
                props.vertical ? 'is-vertical' : 'is-horizontal',
            ];
        });

        // 滑动块样式
        const thumbStyle = computed(() => {
            let obj = {};

            // 垂直
            if (props.vertical) {
                obj = {
                    height: props.barWidth,
                    transform: `translateY(${props.moveX}%)`,
                };
            }
            // 横向
            else {
                obj = {
                    width: props.barWidth,
                    transform: `translateX(${props.moveX}%)`,
                };
            }

            return obj;
        });

        // 偏移比率
        const offsetRatio = computed(() => {
            // thumbWrapper height = scrollbarWrapper height - 4

            // 垂直
            // offsetRatioY = 滚动条的原始高度 / 表格滚动高度 / ratioY / 滚动块高度
            if (props.vertical) {
                return (
                    thumbWrapper.value.offsetHeight ** 2 /
                    IvueScrollbar.scrollbarWrapper.scrollHeight /
                    props.ratioX /
                    thumb.value.offsetHeight
                );
            }

            // 横向
            // offsetRatioX = 滚动条的原始宽度 / 表格滚动宽度 / ratioX / 滚动块宽度
            if (!props.vertical) {
                return (
                    thumbWrapper.value.offsetWidth ** 2 /
                    IvueScrollbar.scrollbarWrapper.scrollWidth /
                    props.ratioX /
                    thumb.value.offsetWidth
                );
            }

            return null;
        });

        // methods

        // 滑动块拖动
        const handleThumbMousedown = (event: MouseEvent) => {
            event.stopPropagation();

            // 防止中键和右键的点击事件;
            if (event.ctrlKey || [1, 2].includes(event.button)) {
                return;
            }

            // 取消所有选择
            window.getSelection()?.removeAllRanges();

            // 阻止监听同一事件的其他事件监听器被调用
            event.stopImmediatePropagation();

            // 鼠标按下
            mousedown = true;

            // 鼠标移动
            on(document, 'mousemove', handleMousemove);

            // 鼠标按下
            on(document, 'mouseup', handleMouseup);

            // 开始选择任意文本内容时触发
            originalOnSelectStart = document.onselectstart;

            // 禁止选中
            document.onselectstart = () => false;

            // 当前目标
            const target = event.currentTarget as HTMLDivElement;

            if (!target) {
                return;
            }

            // 垂直
            if (props.vertical) {
                // 可偏移高度
                data.thumbState['Y'] =
                    target.offsetWidth -
                    (event.clientY - target.getBoundingClientRect().top);
            }

            // 横向
            if (!props.vertical) {
                // 可偏移宽度
                data.thumbState['X'] =
                    target.offsetWidth -
                    (event.clientX - target.getBoundingClientRect().left);
            }
        };

        // 鼠标移动
        const handleMousemove = (event: MouseEvent) => {
            // 是否有dom
            if (!thumbWrapper.value || !thumb.value) {
                return;
            }

            // 鼠标按下
            if (mousedown === false) {
                return;
            }

            // 点击时的偏移位置
            let clickOffset = 0;

            // 拖动时的偏移位置
            let moveOffset = 0;

            // 点击位置
            let clickPosition = 0;

            // 垂直
            if (props.vertical) {
                // 是否可以偏移
                clickOffset = data.thumbState['Y'];

                if (!clickOffset) {
                    return;
                }

                // 拖动时的偏移位置
                moveOffset =
                    (thumbWrapper.value.getBoundingClientRect().top -
                        event.clientY) *
                    -1;

                // 在滚动条点击的位置
                clickPosition = thumb.value.offsetHeight - clickOffset;

                // 点击位置的百分比
                const clickPositionPercentage =
                    // 拖动时的偏移位置 - 点击时的偏移位置 * 100 * 偏移比率
                    ((moveOffset - clickPosition) * 100 * offsetRatio.value) /
                    thumbWrapper.value.offsetHeight;

                // 设置滚动高度
                IvueScrollbar.scrollbarWrapper.scrollTop =
                    (clickPositionPercentage *
                        IvueScrollbar.scrollbarWrapper.scrollHeight) /
                    100;
            }

            // 横向
            if (!props.vertical) {
                // 是否可以偏移
                clickOffset = data.thumbState['X'];

                if (!clickOffset) {
                    return;
                }

                // 拖动时的偏移位置
                moveOffset =
                    (thumbWrapper.value.getBoundingClientRect().left -
                        event.clientX) *
                    -1;

                // 在滚动条点击的位置
                clickPosition = thumb.value.offsetWidth - clickOffset;

                // 点击位置的百分比
                const clickPositionPercentage =
                    ((moveOffset - clickPosition) * 100 * offsetRatio.value) /
                    thumbWrapper.value.offsetWidth;

                // 设置滚动宽度
                IvueScrollbar.scrollbarWrapper.scrollLeft =
                    (clickPositionPercentage *
                        IvueScrollbar.scrollbarWrapper.scrollWidth) /
                    100;
            }
        };

        // 鼠标按下
        const handleMouseup = () => {
            mousedown = false;

            // 垂直
            if (props.vertical) {
                data.thumbState['Y'] = 0;
            }

            // 横向
            if (!props.vertical) {
                data.thumbState['X'] = 0;
            }

            // 鼠标移动
            off(document, 'mousemove', handleMousemove);

            // 鼠标按下
            off(document, 'mouseup', handleMouseup);

            // 恢复选择任意文本内容时触发
            handleRestoreSelectStart();
        };

        // 恢复选择
        const handleRestoreSelectStart = () => {
            if (document.onselectstart !== originalOnSelectStart) {
                document.onselectstart = originalOnSelectStart;
            }
        };

        // 滚动条点击
        const handleThumbWrapperMousedown = (event: MouseEvent) => {
            if (
                !thumb.value ||
                !thumbWrapper.value ||
                !IvueScrollbar.scrollbarWrapper
            ) {
                return;
            }

            let offset = 0;

            // 元素的大小及其相对于视口的位置。
            const boundingClientRect = (
                event.target as HTMLElement
            ).getBoundingClientRect();

            // 垂直
            // if (props.vertical) {
            //     offset = Math.abs(boundingClientRect.top - e[bar.value.client]);
            // }

            // // 横向
            // if (!props.vertical) {
            //     offset = Math.abs(
            //         (event.target as HTMLElement).getBoundingClientRect()[
            //             bar.value.direction
            //         ] - e[bar.value.client]
            //     );
            // }
        };

        return {
            prefixCls,
            // dom
            thumbWrapper,
            thumb,

            // data
            data,

            // computed
            wrapperClass,
            thumbStyle,

            // methods
            handleThumbMousedown,
            handleThumbWrapperMousedown,
        };
    },
});
</script>
