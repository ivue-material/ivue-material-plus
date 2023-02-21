<template>
  <div :class="bem.b()" :style="wrapperStyles" ref="wrapper">
    <!-- 加载中 -->
    <div :class="bem.b('loading')" v-if="loading">
      <slot name="loading">
        <span>{{ loadingText }}</span>
      </slot>
    </div>
    <!-- 加载错误 -->
    <div :class="bem.b('error')" v-else-if="imageError">
      <slot name="error">
        <span>{{ errorText }}</span>
      </slot>
    </div>
    <!-- 内容 -->
    <div :class="bem.b('content')" @click="handlePreview" v-if="loadingImage">
      <img
        :src="src"
        :class="bem.be('content', 'image')"
        :style="imageStyles"
        :referrerPolicy="referrerPolicy"
        :loading="loadingType"
        @load="handleImageLoad"
        @error="handleImageError"
      />
      <slot name="preview" v-if="preview && previewTip">
        <div :class="bem.be('content', 'mask')">
          <span>{{ previewText }}</span>
        </div>
      </slot>
    </div>

    <!-- 图片预览 -->
    <image-preview
      v-model="imagePreviewModal"
      :previewList="previewList"
      :initialIndex="initialIndex"
      @on-close="handleImagePreviewClose"
      @on-switch="handleImageSwitch"
    ></image-preview>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  computed,
  onMounted,
  onBeforeUnmount,
  unref,
} from 'vue';
import { useNamespace } from '@ivue-material-plus/hooks';

// utils
import { isClient, isElement, letter } from '@ivue-material-plus/utils';
import ImagePreview from './image-preview.vue';

// image
import { imageProps } from './image';

const prefixCls = 'ivue-image';

export default defineComponent({
  name: prefixCls,
  emits: ['on-click', 'on-load', 'on-error', 'on-close', 'on-switch'],
  props: imageProps,
  setup(props, { emit }) {
    // bem
    const bem = useNamespace(prefixCls);

    // dom
    const wrapper = ref<HTMLDivElement>();

    // 图片加载中
    const loadingImage = ref<boolean>(false);
    // 加载中
    const loading = ref<boolean>(false);
    // 图片错误
    const imageError = ref<boolean>(false);
    // 滚动的元素
    const scrollElement = ref<HTMLElement | null | string>();
    // 图片预览弹窗
    const imagePreviewModal = ref<boolean>(false);
    // 异步检测目标元素与祖先元素或 viewport 相交情况变化的方法
    const observer = ref<IntersectionObserver>();

    // computed

    // 外部样式
    const wrapperStyles = computed(() => {
      let obj = {};

      // 圆角
      if (props.radius) {
        // 是否有单位
        const isUnit = letter.test(`${props.radius}`);

        obj = {
          borderRadius: !isUnit ? `${props.radius}px` : props.radius,
        };
      }

      return obj;
    });

    // 图片样式
    const imageStyles = computed(() => {
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
      loading.value = false;

      // 图片错误
      imageError.value = false;

      // 图片加载成功
      emit('on-load');
    };

    // 图片错误
    const handleImageError = () => {
      loading.value = false;

      // 图片错误
      imageError.value = true;

      // 图片加载中
      loadingImage.value = false;

      // 图片加载失败
      emit('on-error');
    };

    // 懒加载图片
    const lazyImage = () => {
      scrollElement.value = null;

      // 元素
      if (isElement(props.scrollContainer as HTMLElement)) {
        scrollElement.value = props.scrollContainer;
      }
      // 不是元素
      else if (
        props.scrollContainer &&
        typeof props.scrollContainer === 'string'
      ) {
        // 寻找元素
        scrollElement.value = document.querySelector(
          props.scrollContainer
        ) as HTMLElement;
      }

      // 懒加载 IntersectionObserver
      handIntersectionObserverle();
    };

    // 初始化加载图片
    const initLoadImage = () => {
      loading.value = false;

      // 图片错误
      imageError.value = false;

      // 图片加载中
      loadingImage.value = true;
    };

    // 懒加载
    const handIntersectionObserverle = () => {
      // https://developer.mozilla.org/zh-CN/docs/Web/API/Intersection_Observer_API
      // 注册一个回调函数，每当被监视的元素进入或者退出另外一个元素时 (或者 viewport )，
      // 或者两个元素的相交部分大小发生变化时，该回调方法会被触发执行 handlerObserveImage
      // 我们网站的主线程不需要再为了监听元素相交而辛苦劳作，浏览器会自行优化元素相交管理。
      observer.value = new IntersectionObserver(handlerObserveImage, {
        // 指定根 (root) 元素，用于检查目标的可见性
        root: scrollElement.value as HTMLElement,
        // 根 (root) 元素的外边距
        rootMargin: '0px',
        // 可以是单一的 number 也可以是 number 数组，
        // target 元素和 root 元素相交程度达到该值的时候
        // IntersectionObserver 注册的回调函数将会被执行
        threshold: 0,
      });

      unref(observer)!.observe(wrapper.value!);
    };

    // 异步加载图片
    const handlerObserveImage = (entries: IntersectionObserverEntry[]) => {
      for (const entry of entries) {
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
      unref(observer) && unref(observer)!.disconnect();
    };

    // 预览图片
    const handlePreview = () => {
      if (props.preview) {
        imagePreviewModal.value = true;

        // 图片点击
        emit('on-click', {
          initialIndex: props.initialIndex,
        });
      }
    };

    // 切换
    const handleImageSwitch = (params: { currentIndex: number }) => {
      // 图片预览切换
      emit('on-switch', params);
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
      bem,

      // dom
      wrapper,

      // data
      loadingImage,
      loading,
      imageError,
      imagePreviewModal,

      // computed
      wrapperStyles,
      imageStyles,
      loadingType,

      // methods
      handleImageLoad,
      handleImageError,
      handlePreview,
      handleImagePreviewClose,
      handleImageSwitch,
    };
  },
  components: {
    ImagePreview,
  },
});
</script>
