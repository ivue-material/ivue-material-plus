<template>
    <teleport to="body" :disabled="!transfer">
        <!-- 蒙层 -->
        <transition name="fade">
            <div :class="`${prefixCls}-mask`" :style="maskStyle" v-if="modelValue"></div>
        </transition>
        <!-- 内容 -->
        <transition name="fade">
            <div :class="`${prefixCls}-wrapper`" :style="maskStyle" v-if="modelValue" ref="wrapper">
                <div :class="prefixCls" @click.stop="handleClickMask">
                    <!-- 加载中 -->
                    <ivue-spin
                        :class="`${prefixCls}-loading`"
                        :size="32"
                        v-if="data.imageStatus === 'loading'"
                    ></ivue-spin>
                    <!-- 加载错误 -->
                    <div :class="`${prefixCls}-error`" v-if="data.imageStatus === 'error'">
                        <span>加载失败</span>
                    </div>
                    <!-- 图片 -->
                    <img
                        :style="imageStyle"
                        :class="imageClasses"
                        :src="currentImage"
                        :key="`${data.currentIndex}`"
                        @click.stop
                        @load="handleImageLoad"
                        @error="handleImageError"
                        @mousedown.stop.prevent="handleMousedown"
                        @touchstart.stop.prevent="handleTouchStart"
                    />
                    <!-- 左按钮 -->
                    <ivue-icon
                        :class="`${prefixCls}-left`"
                        @click.stop="handleImageSwitch(false)"
                    >chevron_left</ivue-icon>
                    <!-- 右按钮 -->
                    <ivue-icon
                        :class="`${prefixCls}-right`"
                        @click.stop="handleImageSwitch(true)"
                    >chevron_right</ivue-icon>
                    <!-- 关闭按钮 -->
                    <ivue-icon :class="`${prefixCls}-close`" @click.stop="handleClose">close</ivue-icon>
                    <!-- toolbar -->
                    <div
                        :class="`${prefixCls}-toolbar`"
                        v-if="toolbar && toolbar.length > 0"
                        @click.stop
                    >
                        <!-- 放大 -->
                        <ivue-icon
                            :class="`${prefixCls}-toolbar--item`"
                            :order="toolbar.indexOf('zoomIn') + 1"
                            @click.stop="handleOperation('zoomIn')"
                            v-if="toolbar.indexOf('zoomIn') > -1"
                        >zoom_in</ivue-icon>
                        <!-- 缩小 -->
                        <ivue-icon
                            :class="`${prefixCls}-toolbar--item`"
                            :order="toolbar.indexOf('zoomOut') + 1"
                            @click.stop="handleOperation('zoomOut')"
                            v-if="toolbar.indexOf('zoomOut') > -1"
                        >zoom_out</ivue-icon>
                        <!-- original -->
                        <ivue-icon
                            :class="`${prefixCls}-toolbar--item`"
                            :order="toolbar.indexOf('original') + 1"
                            @click.stop="handleOperation('original')"
                            v-if="toolbar.indexOf('original') > -1"
                        >{{ !data.original ? 'crop_free' : 'zoom_out_map' }}</ivue-icon>
                        <!-- 左旋转 -->
                        <ivue-icon
                            :class="`${prefixCls}-toolbar--item`"
                            :order="toolbar.indexOf('rotateLeft') + 1"
                            @click.stop="handleOperation('rotateLeft')"
                            v-if="toolbar.indexOf('rotateLeft') > -1"
                        >rotate_left</ivue-icon>
                        <!-- 右旋转 -->
                        <ivue-icon
                            :class="`${prefixCls}-toolbar--item`"
                            :order="toolbar.indexOf('rotateRight') + 1"
                            @click.stop="handleOperation('rotateRight')"
                            v-if="toolbar.indexOf('rotateRight') > -1"
                        >rotate_right</ivue-icon>
                        <!-- 下载 -->
                        <ivue-icon
                            :class="`${prefixCls}-toolbar--item`"
                            :order="toolbar.indexOf('download') + 1"
                            @click.stop="handleOperation('download')"
                            v-if="toolbar.indexOf('download') > -1 && !data.downloading"
                        >save_alt</ivue-icon>
                        <!-- 下载中 -->
                        <ivue-icon
                            :class="[`${prefixCls}-toolbar--item`, `${prefixCls}-toolbar--wait`, 'ivue-load-loop']"
                            :order="toolbar.indexOf('download') + 1"
                            @click.stop="handleOperation('download')"
                            v-if="toolbar.indexOf('download') > -1 && data.downloading"
                        >loop</ivue-icon>
                    </div>
                </div>
            </div>
        </transition>
    </teleport>
</template>

<script lang='ts'>
import {
    computed,
    defineComponent,
    getCurrentInstance,
    nextTick,
    reactive,
    ref,
    watch,
} from 'vue';
import throttle from 'lodash.throttle';
import IvueSpin from '../ivue-spin';
import IvueIcon from '../ivue-icon';

import { transferIndex, transferIncrease } from '../../utils/transfer-queue';
import { on, off } from '../../utils/dom';
import { isClient, downloadFile } from '../../utils/helpers';

const prefixCls = 'ivue-image-preview';

export default defineComponent({
    name: prefixCls,
    emits: ['update:modelValue', 'on-close', 'on-switch'],
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
        /**
         * 打开预览的第一项
         *
         * @type {Number}
         */
        initialIndex: {
            type: Number,
            default: 0,
        },
        /**
         * 是否允许点击遮罩层关闭
         *
         * @type {Boolean}
         */
        maskClosable: {
            type: Boolean,
            default: true,
        },
        /**
         * 图片预览列表
         *
         * @type {Array}
         */
        previewList: {
            type: Array,
            default: () => [],
        },
        /**
         * 是否循环切换
         *
         * @type {Boolean}
         */
        infinite: {
            type: Boolean,
            default: true,
        },
        /**
         * 图片预览操作栏选项，按数组顺序排序
         *
         * @type {Array}
         */
        toolbar: {
            type: Array,
            default() {
                const global =
                    getCurrentInstance().appContext.config.globalProperties;

                return !global.$IVUE ||
                    !global.$IVUE.image ||
                    global.$IVUE.image.toolbar === ''
                    ? [
                          'zoomIn',
                          'zoomOut',
                          'original',
                          'rotateLeft',
                          'rotateRight',
                          'download',
                      ]
                    : global.$IVUE.image.toolbar;
            },
        },
    },
    setup(props: any, { emit }) {
        // dom
        const wrapper = ref(null);

        // computed

        // 蒙版样式
        const maskStyle = computed(() => {
            return {
                zIndex: data.maskIndex + 1000,
            };
        });

        // 当前选择的图片
        const currentImage = computed(() => {
            return props.previewList[data.currentIndex];
        });

        // 图片class
        const imageClasses = computed(() => {
            return [
                `${prefixCls}-image`,
                {
                    // 抓取图片中
                    [`${prefixCls}-grabbing`]: !data.transition,
                    // 隐藏图片
                    [`${prefixCls}-hidden`]: data.imageStatus === 'error',
                    // transition
                    [`${prefixCls}-transition`]: data.transition,
                    // 限制图片大小
                    [`${prefixCls}-limit`]: !data.original,
                },
            ];
        });

        // 图片style
        const imageStyle = computed(() => {
            let translateX = data.imageTranslate.x / data.imageScale;
            let translateY = data.imageTranslate.y / data.imageScale;

            const mod = data.imageRotate % 360;

            // 90, -270
            if ([90, -270].includes(mod)) {
                [translateX, translateY] = [translateY, -translateX];
            }

            // 180 , -180
            if ([180, -180].includes(mod)) {
                [translateX, translateY] = [-translateX, -translateY];
            }

            // 270 , -90
            if ([270, -90].includes(mod)) {
                [translateX, translateY] = [-translateY, translateX];
            }

            return {
                transform: `
                        scale(${data.imageScale})
                        rotate(${data.imageRotate}deg)
                        translate(${translateX}px, ${translateY}px)
                    `,
            };
        });

        // methods

        // 蒙版index
        const getMaskIndex = () => {
            transferIncrease();

            return transferIndex;
        };

        // 点击蒙层
        const handleClickMask = () => {
            // 是否允许点击遮罩层关闭
            if (!props.maskClosable) {
                return;
            }

            // 关闭
            handleClose();
        };

        // 关闭
        const handleClose = () => {
            emit('update:modelValue', false);
            emit('on-close');
        };

        // 图片加载成功
        const handleImageLoad = () => {
            data.imageStatus = 'loaded';
        };

        // 图片加载失败
        const handleImageError = () => {
            data.imageStatus = 'error';
        };

        // 鼠标按下
        const handleMousedown = (event) => {
            const {
                pageX,
                pageY,
                // 表示被按下的按钮
                which,
            } = event;

            // 没有按下
            if (which !== 1) {
                return;
            }

            // 触发事件的位置
            data.startX = pageX;
            data.startY = pageY;

            data.transition = false;

            on(document, 'mousemove', handleMousemove);
            on(document, 'mouseup', handleMouseup);
        };

        // 鼠标移动 节流 throttle
        const handleMousemove = throttle((event) => {
            event.stopPropagation();

            const { pageX, pageY } = event;

            data.imageTranslate.x += pageX - data.startX;
            data.imageTranslate.y += pageY - data.startY;

            // 触发事件的位置
            data.startX = pageX;
            data.startY = pageY;
        });

        // 鼠标松开
        const handleMouseup = () => {
            data.transition = true;

            off(document, 'mousemove', handleMousemove);
            off(document, 'mouseup', handleMouseup);
        };

        // 手指按下
        const handleTouchStart = (event) => {
            const { pageX, pageY } = event.touches[0];

            // 触发事件的位置
            data.startX = pageX;
            data.startY = pageY;

            data.transition = false;

            on(document, 'touchmove', handleTouchmove);
            on(document, 'touchend', handleTouchend);
        };

        // 手指移动
        const handleTouchmove = throttle((event) => {
            event.stopPropagation();

            const { pageX, pageY } = event.touches[0];

            data.imageTranslate.x += pageX - data.startX;
            data.imageTranslate.y += pageY - data.startY;

            // 触发事件的位置
            data.startX = pageX;
            data.startY = pageY;
        });

        // 手指离开
        const handleTouchend = () => {
            data.transition = true;

            off(document, 'touchmove', handleTouchmove);
            off(document, 'touchend', handleTouchend);
        };

        // 重制样式
        const resetStyle = () => {
            data.imageScale = 1;
            data.imageRotate = 0;

            data.imageTranslate = {
                x: 0,
                y: 0,
            };
        };

        // 获取body样式
        const getBodyOverflow = () => {
            return isClient ? document.body.style.overflow : '';
        };

        // 设置body样式
        const setBodyOverflow = (value: string) => {
            if (!isClient) {
                return;
            }

            document.body.style.overflow = value;
        };

        // 鼠标滚动
        const handleWheel = (event) => {
            // 显示弹窗
            if (!props.modelValue) {
                return;
            }

            const { deltaY } = event;

            // 处理事件
            handleOperation(deltaY < 0 ? 'zoomIn' : 'zoomOut');
        };

        // 处理事件
        const handleOperation = (
            value:
                | 'zoomIn'
                | 'zoomOut'
                | 'original'
                | 'rotateLeft'
                | 'rotateRight'
                | 'download'
        ) => {
            // 放大
            if (value === 'zoomIn' && data.imageScale < 6) {
                data.imageScale += 0.25;
            }

            // 缩小
            if (value === 'zoomOut' && data.imageScale > 0.25) {
                data.imageScale -= 0.25;
            }

            // 按原尺寸显示
            if (value === 'original') {
                data.original = !data.original;

                data.transition = false;

                // 重制样式
                resetStyle();

                setTimeout(() => {
                    data.transition = true;
                }, 0);
            }

            // 左旋转
            if (value === 'rotateLeft') {
                data.imageRotate -= 90;
            }

            // 右旋转
            if (value === 'rotateRight') {
                data.imageRotate += 90;
            }

            // 下载
            if (value === 'download') {
                data.downloading = true;

                downloadFile(props.previewList[data.currentIndex])
                    .then(() => {
                        data.downloading = false;
                    })
                    .catch(() => {
                        data.downloading = false;
                    });
            }
        };

        // 键盘按下
        const handleKeydown = (event) => {
            // 是否显示弹窗
            if (!props.modelValue) {
                return;
            }

            const { keyCode } = event;

            // 左边键盘
            if (keyCode === 37) {
                handleImageSwitch(false);
            }

            // 右边键盘
            if (keyCode === 39) {
                handleImageSwitch(true);
            }

            // 上按钮
            if (keyCode === 38) {
                handleOperation('zoomIn');
            }

            // 下按钮
            if (keyCode === 40) {
                handleOperation('zoomOut');
            }

            // 空格
            if (keyCode === 32) {
                event.preventDefault();

                data.original = !data.original;
            }
        };

        // 键盘松开
        const handleKeyup = (event) => {
            // 是否显示弹窗
            if (!props.modelValue) {
                return;
            }

            const { keyCode } = event;

            // 退出健
            if (keyCode === 27) {
                handleClose();
            }
        };

        // 切换
        const handleImageSwitch = (next: boolean) => {
            // 下一个
            if (next) {
                // 是否是最后一个图片
                if (data.currentIndex + 1 === props.previewList.length) {
                    // 是否循环切换
                    if (props.infinite) {
                        // 重制样式
                        resetStyle();

                        data.currentIndex = 0;
                    }
                }
                // 下一个
                else {
                    // 重制样式
                    resetStyle();

                    data.currentIndex += 1;
                }
            }
            // 上一个
            else {
                // 第一个图片
                if (data.currentIndex === 0) {
                    // 是否循环切换
                    if (props.infinite) {
                        // 重制样式
                        resetStyle();

                        // 重新设置当前图片
                        data.currentIndex = props.previewList.length - 1;
                    }
                }
                // 下一个
                else {
                    resetStyle();

                    data.currentIndex -= 1;
                }
            }

            emit('on-switch', {
                currentIndex: data.currentIndex,
            });
        };

        // data
        const data: any = reactive<{
            maskIndex: number;
            imageStatus: string;
            currentIndex: number;
            transition: boolean;
            original: boolean;
            startX: number;
            startY: number;
            imageTranslate: {
                x: number;
                y: number;
            };
            imageScale: number;
            imageRotate: number;
            prevOverflow: string;
            downloading: boolean;
        }>({
            /**
             * 蒙层zIndex
             *
             * @type {Number}
             */
            maskIndex: getMaskIndex(),
            /**
             * 图片状态
             *
             * @type {String}
             */
            imageStatus: 'loading',
            /**
             * 当前index
             *
             * @type {Number}
             */
            currentIndex: 0,
            /**
             * 图片transition
             *
             * @type {Boolean}
             */
            transition: true,
            /**
             * 按原尺寸显示
             *
             * @type {Boolean}
             */
            original: false,
            /**
             * X轴
             *
             * @type {Number}
             */
            startX: 0,
            /**
             * Y轴
             *
             * @type {Number}
             */
            startY: 0,
            /**
             * 图片移动位置
             *
             * @type {Object}
             */
            imageTranslate: {
                x: 0,
                y: 0,
            },
            /**
             * 图片缩放大小
             *
             * @type {Number}
             */
            imageScale: 1,
            /**
             * 图片旋转角度
             *
             * @type {NUmber}
             */
            imageRotate: 0,
            /**
             * 防止body滚动
             *
             * @type {String}
             */
            prevOverflow: '',
            /**
             * 下载中
             *
             * @type {Boolean}
             */
            downloading: false,
        });

        // watch

        // 监听弹窗显示
        watch(
            () => props.modelValue,
            (value) => {
                // 显示
                if (value) {
                    // 设置当前index
                    data.currentIndex = props.initialIndex;

                    // 重制样式
                    resetStyle();

                    // 按原尺寸显示
                    data.original = false;

                    // 获取body样式
                    data.prevOverflow = getBodyOverflow();

                    // 设置body样式
                    setBodyOverflow('hidden');

                    // 蒙层zIndex
                    data.maskIndex = getMaskIndex();

                    nextTick(() => {
                        // 鼠标滚动
                        on(wrapper.value, 'wheel', handleWheel);
                        // 键盘按下
                        on(document, 'keydown', handleKeydown);
                        // 键盘松开
                        on(document, 'keyup', handleKeyup);
                    });
                }
                // 隐藏
                else {
                    // 重新设置body样式
                    setBodyOverflow(data.prevOverflow);

                    // 鼠标滚动
                    off(wrapper.value, 'wheel', handleWheel);
                    // 键盘按下
                    off(document, 'keydown', handleKeydown);
                    // 键盘松开
                    off(document, 'keyup', handleKeyup);
                }
            }
        );

        // 监听当前index变化
        watch(
            () => data.currentIndex,
            () => {
                data.imageStatus = 'loading';
            }
        );

        return {
            prefixCls,
            // dom
            wrapper,

            // data
            data,

            // computed
            maskStyle,
            currentImage,
            imageClasses,
            imageStyle,

            // methods
            handleClickMask,
            handleImageLoad,
            handleImageError,
            handleMousedown,
            handleImageSwitch,
            handleOperation,
            handleClose,
            handleTouchStart,
            resetStyle,
        };
    },
    components: {
        IvueSpin,
        IvueIcon,
    },
});
</script>
