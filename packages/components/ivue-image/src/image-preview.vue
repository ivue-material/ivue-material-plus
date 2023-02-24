<template>
  <teleport to="body" :disabled="!transfer">
    <!-- 蒙层 -->
    <transition name="fade">
      <div :class="bem.b('mask')" :style="maskStyles" v-if="modelValue"></div>
    </transition>
    <!-- 内容 -->
    <transition name="fade">
      <div
        :class="bem.b('wrapper')"
        :style="maskStyles"
        ref="wrapper"
        v-if="modelValue"
      >
        <div :class="bem.b()" @click.stop="handleClickMask">
          <!-- 加载中 -->
          <ivue-spin
            :class="bem.e('loading')"
            :size="32"
            v-if="imageStatus === 'loading'"
          ></ivue-spin>
          <!-- 加载错误 -->
          <div :class="bem.e('error')" v-if="imageStatus === 'error'">
            <span>加载失败</span>
          </div>
          <!-- 图片 -->
          <img
            :class="imageClasses"
            :style="imageStyles"
            :src="currentImage"
            :key="`${currentIndex}`"
            @click.stop
            @load="handleImageLoad"
            @error="handleImageError"
            @mousedown.stop.prevent="handleMousedown"
            @touchstart.stop.prevent="handleTouchStart"
          />
          <!-- 左按钮 -->
          <ivue-icon
            :class="bem.b('left')"
            @click.stop="handleImageSwitch(false)"
          >
            chevron_left
          </ivue-icon>
          <!-- 右按钮 -->
          <ivue-icon
            :class="bem.b('right')"
            @click.stop="handleImageSwitch(true)"
          >
            chevron_right
          </ivue-icon>
          <!-- 关闭按钮 -->
          <ivue-icon :class="bem.b('close')" @click.stop="handleClose">
            close
          </ivue-icon>
          <!-- toolbar -->
          <div
            :class="bem.b('toolbar')"
            v-if="toolbar && toolbar.length > 0"
            @click.stop
          >
            <!-- 放大 -->
            <ivue-icon
              :class="bem.be('toolbar', 'item')"
              :order="toolbar.indexOf('zoomIn') + 1"
              @click.stop="handleOperation('zoomIn')"
              v-if="toolbar.indexOf('zoomIn') > -1"
            >
              zoom_in
            </ivue-icon>
            <!-- 缩小 -->
            <ivue-icon
              :class="bem.be('toolbar', 'item')"
              :order="toolbar.indexOf('zoomOut') + 1"
              @click.stop="handleOperation('zoomOut')"
              v-if="toolbar.indexOf('zoomOut') > -1"
            >
              zoom_out
            </ivue-icon>
            <!-- original -->
            <ivue-icon
              :class="bem.be('toolbar', 'item')"
              :order="toolbar.indexOf('original') + 1"
              @click.stop="handleOperation('original')"
              v-if="toolbar.indexOf('original') > -1"
            >
              {{ !original ? 'crop_free' : 'zoom_out_map' }}
            </ivue-icon>
            <!-- 左旋转 -->
            <ivue-icon
              :class="bem.be('toolbar', 'item')"
              :order="toolbar.indexOf('rotateLeft') + 1"
              @click.stop="handleOperation('rotateLeft')"
              v-if="toolbar.indexOf('rotateLeft') > -1"
            >
              rotate_left
            </ivue-icon>
            <!-- 右旋转 -->
            <ivue-icon
              :class="bem.be('toolbar', 'item')"
              :order="toolbar.indexOf('rotateRight') + 1"
              @click.stop="handleOperation('rotateRight')"
              v-if="toolbar.indexOf('rotateRight') > -1"
            >
              rotate_right
            </ivue-icon>
            <!-- 下载 -->
            <ivue-icon
              :class="bem.be('toolbar', 'item')"
              :order="toolbar.indexOf('download') + 1"
              @click.stop="handleOperation('download')"
              v-if="toolbar.indexOf('download') > -1 && !downloading"
            >
              save_alt
            </ivue-icon>
            <!-- 下载中 -->
            <ivue-icon
              :class="[
                bem.be('toolbar', 'item'),
                bem.is('wait'),
                'ivue-animation-loop',
              ]"
              :order="toolbar.indexOf('download') + 1"
              @click.stop="handleOperation('download')"
              v-if="toolbar.indexOf('download') > -1 && downloading"
            >
              loop
            </ivue-icon>
          </div>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<script lang="ts">
import { computed, defineComponent, nextTick, ref, watch, unref } from 'vue';
import throttle from 'lodash.throttle';

// utils
import {
  transferIndex,
  transferIncrease,
  isClient,
  EVENT_CODE,
} from '@ivue-material-plus/utils';
import { on, off } from '@ivue-material-plus/utils/dom';
// hooks
import { downloadFile, useNamespace } from '@ivue-material-plus/hooks';

// image-preview
import { imagePreviewProps } from './image-preview';

// components
import IvueSpin from '@ivue-material-plus/components/ivue-spin';
import { IvueIcon } from '@ivue-material-plus/components';

const prefixCls = 'ivue-image-preview';

export default defineComponent({
  name: prefixCls,
  emits: ['update:modelValue', 'on-close', 'on-switch'],
  props: imagePreviewProps,
  setup(props, { emit }) {
    // bem
    const bem = useNamespace(prefixCls);

    // dom
    const wrapper = ref<HTMLElement>();

    // 蒙版index
    const getMaskIndex = () => {
      transferIncrease();

      return transferIndex;
    };

    // 蒙层zIndex
    const maskIndex = ref<number>(getMaskIndex());
    // 图片状态
    const imageStatus = ref<string>('loading');
    // 当前index
    const currentIndex = ref<number>(0);
    // 图片transition
    const transition = ref<boolean>(true);
    // 按原尺寸显示
    const original = ref<boolean>(true);
    // X轴
    const startX = ref<number>(0);
    // Y轴
    const startY = ref<number>(0);
    // 图片缩放大小
    const imageScale = ref<number>(1);
    // 图片旋转角度
    const imageRotate = ref<number>(0);
    // 防止body滚动
    const prevOverflow = ref<string>('');
    // 下载中
    const downloading = ref<boolean>(false);
    // 图片移动位置
    const imageTranslate = ref({
      x: 0,
      y: 0,
    });

    // computed

    // 蒙版样式
    const maskStyles = computed(() => {
      return {
        zIndex: unref(maskIndex) + 1000,
      };
    });

    // 当前选择的图片
    const currentImage = computed(() => {
      return props.previewList[unref(currentIndex)];
    });

    // 图片class
    const imageClasses = computed(() => {
      return [
        bem.e('image'),
        {
          // 抓取图片中
          [bem.is('grabbing')]: !unref(transition),
          // 隐藏图片
          [bem.is('hidden')]: unref(imageStatus) === 'error',
          // transition
          [bem.is('transition')]: unref(transition),
          // 限制图片大小
          [bem.is('limit')]: !unref(original),
        },
      ];
    });

    // 图片style
    const imageStyles = computed(() => {
      let translateX = unref(imageTranslate).x / unref(imageScale);
      let translateY = unref(imageTranslate).y / unref(imageScale);

      const mod = unref(imageRotate) % 360;

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
          scale(${unref(imageScale)})
          rotate(${unref(imageRotate)}deg)
          translate(${translateX}px, ${translateY}px)
        `,
      };
    });

    // methods

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
      imageStatus.value = 'loaded';
    };

    // 图片加载失败
    const handleImageError = () => {
      imageStatus.value = 'error';
    };

    // 鼠标按下
    const handleMousedown = (event: MouseEvent) => {
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
      startX.value = pageX;
      startY.value = pageY;

      transition.value = false;

      on(document, 'mousemove', handleMousemove);
      on(document, 'mouseup', handleMouseup);
    };

    // 鼠标移动 节流 throttle
    const handleMousemove = throttle((event) => {
      event.stopPropagation();

      const { pageX, pageY } = event;

      imageTranslate.value.x += pageX - unref(startX);
      imageTranslate.value.y += pageY - unref(startY);

      // 触发事件的位置
      startX.value = pageX;
      startY.value = pageY;
    });

    // 鼠标松开
    const handleMouseup = () => {
      transition.value = true;

      off(document, 'mousemove', handleMousemove);
      off(document, 'mouseup', handleMouseup);
    };

    // 手指按下
    const handleTouchStart = (event: TouchEvent) => {
      const { pageX, pageY } = event.touches[0];

      // 触发事件的位置
      startX.value = pageX;
      startY.value = pageY;

      transition.value = false;

      on(document, 'touchmove', handleTouchmove);
      on(document, 'touchend', handleTouchend);
    };

    // 手指移动
    const handleTouchmove = throttle((event: TouchEvent) => {
      event.stopPropagation();

      const { pageX, pageY } = event.touches[0];

      imageTranslate.value.x += pageX - unref(startX);
      imageTranslate.value.y += pageY - unref(startY);

      // 触发事件的位置
      startX.value = pageX;
      startY.value = pageY;
    });

    // 手指离开
    const handleTouchend = () => {
      transition.value = true;

      off(document, 'touchmove', handleTouchmove);
      off(document, 'touchend', handleTouchend);
    };

    // 重制样式
    const resetStyle = () => {
      imageScale.value = 1;
      imageRotate.value = 0;

      imageTranslate.value = {
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
    const handleWheel = (event: WheelEvent) => {
      // 不设置防止body滚动
      if (!props.bodyOverflow) {
        event.preventDefault();
      }

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
      if (value === 'zoomIn' && unref(imageScale) < 6) {
        imageScale.value += 0.25;
      }

      // 缩小
      if (value === 'zoomOut' && unref(imageScale) > 0.25) {
        imageScale.value -= 0.25;
      }

      // 按原尺寸显示
      if (value === 'original') {
        original.value = !unref(original);

        transition.value = false;

        // 重制样式
        resetStyle();

        setTimeout(() => {
          transition.value = true;
        }, 0);
      }

      // 左旋转
      if (value === 'rotateLeft') {
        imageRotate.value -= 90;
      }

      // 右旋转
      if (value === 'rotateRight') {
        imageRotate.value += 90;
      }

      // 下载
      if (value === 'download') {
        downloading.value = true;

        downloadFile(props.previewList[unref(currentIndex)])
          .then(() => {
            downloading.value = false;
          })
          .catch(() => {
            downloading.value = false;
          });
      }
    };

    // 键盘按下
    const handleKeydown = (event: KeyboardEvent) => {
      // 是否显示弹窗
      if (!props.modelValue) {
        return;
      }

      const { code } = event;

      // 左边键盘
      if (code === EVENT_CODE.left) {
        handleImageSwitch(false);
      }

      // 右边键盘
      if (code === EVENT_CODE.right) {
        handleImageSwitch(true);
      }

      // 上按钮
      if (code === EVENT_CODE.up) {
        handleOperation('zoomIn');
      }

      // 下按钮
      if (code === EVENT_CODE.down) {
        handleOperation('zoomOut');
      }

      // 空格
      if (code === EVENT_CODE.space) {
        event.preventDefault();

        original.value = !unref(original);
      }
    };

    // 键盘松开
    const handleKeyup = (event: KeyboardEvent) => {
      // 是否显示弹窗
      if (!props.modelValue) {
        return;
      }

      const { code } = event;

      // 退出健
      if (code === EVENT_CODE.esc) {
        handleClose();
      }
    };

    // 切换
    const handleImageSwitch = (next: boolean) => {
      // 下一个
      if (next) {
        // 是否是最后一个图片
        if (unref(currentIndex) + 1 === props.previewList.length) {
          // 是否循环切换
          if (props.infinite) {
            // 重制样式
            resetStyle();

            currentIndex.value = 0;
          }
        }
        // 下一个
        else {
          // 重制样式
          resetStyle();

          currentIndex.value += 1;
        }
      }
      // 上一个
      else {
        // 第一个图片
        if (unref(currentIndex) === 0) {
          // 是否循环切换
          if (props.infinite) {
            // 重制样式
            resetStyle();

            // 重新设置当前图片
            currentIndex.value = props.previewList.length - 1;
          }
        }
        // 下一个
        else {
          resetStyle();

          currentIndex.value -= 1;
        }
      }

      emit('on-switch', {
        currentIndex: unref(currentIndex),
      });
    };

    // watch

    // 监听弹窗显示
    watch(
      () => props.modelValue,
      (value) => {
        // 显示
        if (value) {
          // 设置当前index
          currentIndex.value = props.initialIndex;

          // 重制样式
          resetStyle();

          // 按原尺寸显示
          original.value = false;

          // 设置防止body滚动
          if (props.bodyOverflow) {
            // 获取body样式
            prevOverflow.value = getBodyOverflow();

            // 设置body样式
            setBodyOverflow('hidden');
          }

          // 蒙层zIndex
          maskIndex.value = getMaskIndex();

          nextTick(() => {
            // 鼠标滚动
            on(wrapper.value!, 'wheel', handleWheel);
            // 键盘按下
            on(document, 'keydown', handleKeydown);
            // 键盘松开
            on(document, 'keyup', handleKeyup);
          });
        }
        // 隐藏
        else {
          // 设置防止body滚动
          if (props.bodyOverflow) {
            // 重新设置body样式
            setBodyOverflow(unref(prevOverflow));
          }

          // 鼠标滚动
          off(wrapper.value!, 'wheel', handleWheel);
          // 键盘按下
          off(document, 'keydown', handleKeydown);
          // 键盘松开
          off(document, 'keyup', handleKeyup);
        }
      }
    );

    // 监听当前index变化
    watch(
      () => unref(currentIndex),
      () => {
        imageStatus.value = 'loading';
      }
    );

    return {
      prefixCls,
      // bem
      bem,

      // dom
      wrapper,

      // data
      imageStatus,
      currentIndex,
      original,
      downloading,

      // computed
      maskStyles,
      currentImage,
      imageClasses,
      imageStyles,

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
