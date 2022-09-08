<template>
    <div :class="prefixCls" :style="wrapperStyles" ref="wrapper">
        <!-- 加载中 -->
        <div :class="`${prefixCls}-loading`" v-if="data.loading">
            <slot name="loading">
                <span>{{ loadingText }}</span>
            </slot>
        </div>
        <!-- 加载错误 -->
        <div :class="`${prefixCls}-error`" v-else-if="data.imageError">
            <slot name="error">
                <span>{{ errorText }}</span>
            </slot>
        </div>
        <!-- content -->
        <div :class="`${prefixCls}-content`" @click="handlePreview" v-if="data.loadingImage">
            <img
                :src="src"
                :class="imageClasses"
                :style="imageStyle"
                :referrerPolicy="referrerPolicy"
                :loading="loadingType"
                @load="handleImageLoad"
                @error="handleImageError"
            />
            <slot name="preview" v-if="preview && previewTip">
                <div :class="`${prefixCls}-mark`">
                    <span>预览</span>
                </div>
            </slot>
        </div>

        <!-- 图片预览 -->
        <image-preview
            v-model="data.imagePreviewModal"
            :previewList="previewList"
            :initialIndex="initialIndex"
            @on-close="handleImagePreviewClose"
        ></image-preview>
    </div>
</template>

<script lang='ts'>
import {
    defineComponent,
    ref,
    computed,
    reactive,
    onMounted,
    onBeforeUnmount,
} from 'vue';
import { isClient, isElement } from '../../utils/helpers';
import { oneOf } from '../../utils/assist';
import ImagePreview from './image-preview.vue';

const prefixCls = 'ivue-image';

export default defineComponent({
    name: prefixCls,
    emits: ['on-click', 'on-load', 'on-error', 'on-close'],
    props: {
        /**
         * 圆角
         *
         * @type {Number | String}
         */
        radius: {
            type: [Number, String],
            default: 0,
        },
        /**
         * 图片源地址
         *
         * @type {String}
         */
        src: {
            type: String,
            default: '',
        },
        /**
         * 确定图片如何适应容器框，同原生 object-fit
         *
         * @type {String}
         */
        fit: {
            type: String,
            values: ['', 'contain', 'cover', 'fill', 'none', 'scale-down'],
            default: '',
        },
        /**
         * 图片描述
         *
         * @type {String}
         */
        alt: {
            type: String,
            default: '',
        },
        /**
         * 首部用来监管哪些访问来源信息
         *
         * @type {String}
         */
        referrerPolicy: {
            type: String,
            validator(value: string) {
                return oneOf(value, [
                    'no-referrer',
                    'no-referrer-when-downgrade',
                    'origin',
                    'origin-when-cross-origin',
                    'same-origin',
                    'strict-origin',
                    'strict-origin-when-cross-origin',
                    'unsafe-url',
                ]);
            },
        },
        /**
         * 是否使用懒加载
         *
         * @type {Boolean}
         */
        lazy: {
            type: Boolean,
            default: false,
        },
        /**
         * loading文案
         *
         * @type {String}
         */
        loadingText: {
            type: String,
            default: '加载中',
        },
        /**
         * 加载错误文案
         *
         * @type {String}
         */
        errorText: {
            type: String,
            default: '加载失败',
        },
        /**
         * 是否图片预览
         *
         * @type {Boolean}
         */
        preview: {
            type: Boolean,
            default: false,
        },
        /**
         * 是否显示预览提示和遮罩
         *
         * @type {Boolean}
         */
        previewTip: {
            type: Boolean,
            default: true,
        },
        /**
         * 滚动加载容器
         *
         * @type {String}
         */
        scrollContainer: {
            type: String,
            default: '',
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
         * 图片预览列表
         *
         * @type {Array}
         */
        previewList: {
            type: Array,
        },
    },
    setup(props: any, { emit }) {
        // dom
        const wrapper = ref<HTMLElement>();

        // data
        const data: any = reactive<{
            loadingImage: boolean;
            loading: boolean;
            imageError: boolean;
            scrollElement: any;
            observer: IntersectionObserver;
            imagePreviewModal: boolean;
        }>({
            /**
             * 加载中
             *
             * @type {Boolean}
             */
            loadingImage: false,
            /**
             * 加载中
             *
             * @type {Boolean}
             */
            loading: false,
            /**
             * 图片错误
             *
             * @type {Boolean}
             */
            imageError: false,
            /**
             * 滚动的元素
             *
             * @type {String}
             */
            scrollElement: null,
            /**
             * 异步检测目标元素与祖先元素或 viewport 相交情况变化的方法
             *
             * @type {Function}
             */
            observer: null,
            /**
             * 图片预览弹窗
             *
             * @type {Boolean}
             */
            imagePreviewModal: false,
        });

        // computed

        // 外部样式
        const wrapperStyles = computed(() => {
            let obj = {};

            // 圆角
            if (props.radius) {
                const regexp = new RegExp(/[a-zA-Z]/g);

                // 是否有单位
                const isUnit = regexp.test(props.radius);

                obj = {
                    borderRadius: !isUnit ? `${props.radius}px` : props.radius,
                };
            }

            return obj;
        });

        // 图片样式
        const imageClasses = computed(() => {
            return [`${prefixCls}-img`];
        });

        // 图片样式
        const imageStyle = computed(() => {
            const { fit } = props;

            let obj = {};

            // 确定图片如何适应容器框
            if (isClient && fit) {
                obj = {
                    objectFit: fit,
                };
            }

            return obj;
        });

        // 浏览器加载图像的策略
        const loadingType = computed(() => {
            // eager：立即加载图像，无论图像当前是否在可见视口内-默认值
            // lazy：延迟加载图像，直到它达到与浏览器定义的视口的计算距离。
            return props.lazy ? 'lazy' : 'eager';
        });

        // methods

        // 图片完成
        const handleImageLoad = () => {
            data.loading = false;
            data.imageError = false;

            // 图片加载成功
            emit('on-load');
        };

        // 图片错误
        const handleImageError = () => {
            data.loading = false;
            data.imageError = true;

            data.loadingImage = false;

            // 图片加载失败
            emit('on-error');
        };

        // 懒加载图片
        const lazyImage = () => {
            data.scrollElement = null;

            // 元素
            if (isElement(props.scrollContainer)) {
                data.scrollElement = props.scrollContainer;
            }
            // 不是元素
            else if (
                props.scrollContainer &&
                typeof props.scrollContainer === 'string'
            ) {
                // 寻找元素
                data.scrollElement = document.querySelector(
                    props.scrollContainer
                );
            }

            // 懒加载 IntersectionObserver
            handIntersectionObserverle();
        };

        // 初始化加载图片
        const initLoadImage = () => {
            data.loading = true;
            data.imageError = false;

            data.loadingImage = true;
        };

        // 懒加载
        const handIntersectionObserverle = () => {
            // https://developer.mozilla.org/zh-CN/docs/Web/API/Intersection_Observer_API
            // 注册一个回调函数，每当被监视的元素进入或者退出另外一个元素时 (或者 viewport )，
            // 或者两个元素的相交部分大小发生变化时，该回调方法会被触发执行 handlerObserveImage
            // 我们网站的主线程不需要再为了监听元素相交而辛苦劳作，浏览器会自行优化元素相交管理。
            data.observer = new IntersectionObserver(handlerObserveImage, {
                // 指定根 (root) 元素，用于检查目标的可见性
                root: data.scrollElement,
                // 根 (root) 元素的外边距
                rootMargin: '0px',
                // 可以是单一的 number 也可以是 number 数组，
                // target 元素和 root 元素相交程度达到该值的时候
                // IntersectionObserver 注册的回调函数将会被执行
                threshold: 0,
            });

            data.observer.observe(wrapper.value);
        };

        // 异步加载图片
        const handlerObserveImage = (entries) => {
            for (let entry of entries) {
                // 元素是否与交集观察者的根相交
                if (entry.isIntersecting) {
                    // 停止观察其所有目标元素的可见性变化
                    observerDisconnect();
                    // 加载图片
                    initLoadImage();
                }
            }
        };

        // 停止观察其所有目标元素的可见性变化
        const observerDisconnect = () => {
            data.observer && data.observer.disconnect();
        };

        // 预览图片
        const handlePreview = () => {
            // const { preview, initialIndex } = this;
            // if (preview) {
            data.imagePreviewModal = true;

            emit('on-click', {
                initialIndex: props.initialIndex,
            });
            // }
        };

        // 图片预览关闭
        const handleImagePreviewClose = () => {
            emit('on-close');
        };

        // onMounted
        onMounted(() => {
            if (isClient) {
                props.lazy ? lazyImage() : initLoadImage();
            }
        });

        // onBeforeUnmount
        onBeforeUnmount(() => {
            observerDisconnect();
        });

        return {
            prefixCls,

            // dom
            wrapper,

            // data
            data,

            // computed
            wrapperStyles,
            imageClasses,
            imageStyle,
            loadingType,

            // methods
            handleImageLoad,
            handleImageError,
            handlePreview,
            handleImagePreviewClose,
        };
    },
    components: {
        ImagePreview,
    },
});
</script>
