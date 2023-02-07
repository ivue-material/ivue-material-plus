<template>
  <teleport to="body" :disabled="!transfer">
    <!-- 蒙版 -->
    <transition :name="`${transitionNames[1]}`">
      <div
        :class="`${prefixCls}-mask`"
        :style="wrapperStyles"
        @click="handleMask"
        v-show="data.visible"
        v-if="showMask"
      ></div>
    </transition>
    <!-- 弹窗外层 -->
    <div
      :class="wrapperClasses"
      :style="wrapperStyles"
      @click="handleWrapperClick"
    >
      <transition
        :name="`${transitionNames[0]}`"
        @after-leave="handleAfterLeave"
      >
        <!-- 弹窗 -->
        <div
          :class="modalClasses"
          :style="modalStyles"
          v-show="data.visible"
          @mousedown="handleMousedown"
        >
          <!-- 弹窗内容 -->
          <div
            :class="contentClasses"
            :style="contentStyles"
            @click="handleClickModal"
            ref="contentRef"
          >
            <!-- close -->
            <div :class="`${prefixCls}-close`" @click="close" v-if="closable">
              <slot name="close">
                <ivue-icon>{{ closeIcon }}</ivue-icon>
              </slot>
            </div>
            <!-- 头部 -->
            <div :class="`${prefixCls}-header`" ref="headerRef" v-if="showHead">
              <slot name="header">
                <div :class="`${prefixCls}-header--content`">{{ title }}</div>
              </slot>
            </div>
            <!-- 内容 -->
            <!-- 使用v-if重新渲染body -->
            <div :class="`${prefixCls}-body`" v-if="resetBody">
              <template v-if="data.resetRenderBody">
                <slot></slot>
              </template>
            </div>
            <!-- 普通渲染 -->
            <div :class="`${prefixCls}-body`" v-else>
              <slot></slot>
            </div>
            <!-- 底部 -->
            <div :class="`${prefixCls}-footer`" v-if="!footerHide">
              <slot name="footer">
                <!-- 关闭 -->
                <ivue-button
                  :class="`${prefixCls}-footer--button`"
                  outline
                  color="#dcdfe6"
                  @click="handleCancel"
                  >{{ cancelText }}</ivue-button
                >
                <!-- 确认 -->
                <ivue-button
                  :class="`${prefixCls}-footer--button`"
                  depressed
                  status="primary"
                  :loading="data.buttonLoading"
                  @click="handleConfirm"
                  >{{ confirmText }}</ivue-button
                >
              </slot>
            </div>
          </div>
          <!-- 加载中 -->
          <ivue-spin
            :class="`${prefixCls}-spin`"
            fix
            :show="data.spinLoading"
          ></ivue-spin>
        </div>
      </transition>
    </div>
  </teleport>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  getCurrentInstance,
  onBeforeUnmount,
  onMounted,
  reactive,
  ref,
  watch,
} from 'vue';
import { useEventListener } from '@vueuse/core';

import { scrollbarMixins } from './mixins-scrollbar';

import {
  transferIndex as modalIndex,
  transferIncrease as modalIncrease,
} from '../../utils/transfer-queue';
import { currentUid, setCurrentUid } from '../../utils/current-event';
import { deepCopy } from '../../utils/assist';
import { oneOf } from '../../utils/assist';
import { useDraggable } from '../../hooks';

// components
import IvueIcon from '../ivue-icon';
import IvueButton from '../ivue-button';
import IvueSpin from '../ivue-spin';

// ts
import type { _ComponentInternalInstance, Props, Data } from './types/modal';

const prefixCls = 'ivue-modal';

// 拖动初始数据
const dragData = {
  x: null,
  y: null,
  dragX: null,
  dragY: null,
  dragging: false,
  rect: null,
};

export default defineComponent({
  name: prefixCls,
  emits: [
    'update:modelValue',
    'on-cancel',
    'on-hidden',
    'on-confirm',
    'on-visible-change',
  ],
  props: {
    /**
     * modelValue
     *
     * @type {Boolean}
     */
    modelValue: {
      type: Boolean,
      default: false,
    },
    /**
     * 是否将弹层放置于 body 内，在 Tabs、
     * 带有 fixed 的 Table 列内使用时，
     * 建议添加此属性，它将不受父级样式影响，
     * 从而达到更好的效果
     *
     * @type {Boolean}
     */
    transfer: {
      type: Boolean,
      default() {
        const global = getCurrentInstance().appContext.config.globalProperties;

        return !global.$IVUE || global.$IVUE.transfer === ''
          ? false
          : global.$IVUE.transfer;
      },
    },
    /**
     * 自定义显示动画，第一项是模态框，第二项是背景
     *
     * @type {Array}
     */
    transitionNames: {
      type: Array,
      default() {
        return ['zoom', 'fade'];
      },
    },
    /**
     * 弹窗层级
     *
     * @type {Number}
     */
    zIndex: {
      type: Number,
      default: 1000,
    },
    /**
     * 是否显示遮罩层
     *
     * @type {Boolean}
     */
    mask: {
      type: Boolean,
      default: true,
    },
    /**
     * 是否允许点击遮罩层关闭
     *
     * @type {Boolean}
     */
    maskClosable: {
      type: Boolean,
      default() {
        const global = getCurrentInstance().appContext.config.globalProperties;

        return !global.$IVUE || !global.$IVUE.modal.maskClosable
          ? true
          : global.$IVUE.modal.maskClosable;
      },
    },
    /**
     * 返回 Promise 可以阻止关闭
     *
     * @type {Function}
     */
    beforeClose: {
      type: Function,
    },
    /**
     * 弹窗外层样式
     *
     * @type {String}
     */
    modalWrapperClasses: {
      type: String,
    },
    /**
     * 页面是否可以滚动
     *
     * @type {Boolean}
     */
    scrollable: {
      type: Boolean,
      default: false,
    },
    /**
     * 对话框宽度，对话框的宽度是响应式的，
     * 当屏幕尺寸小于 768px 时，宽度会变为自动auto。
     * 当其值不大于 100 时以百分比显示，大于 100 时为像素
     *
     * @type {Number | String}
     */
    width: {
      type: [Number, String],
      default: 520,
    },
    /**
     * 弹窗样式
     *
     * @type {Object}
     */
    styles: {
      type: Object,
      default: () => {},
    },
    /**
     * 标题
     *
     * @type {String}
     */
    title: {
      type: String,
    },
    /**
     * 关闭按钮图标
     *
     * @type {String}
     */
    closeIcon: {
      type: String,
      default: 'cancel',
    },
    /**
     * 是否显示关闭按钮
     *
     * @type {Boolean}
     */
    closable: {
      type: Boolean,
      default: true,
    },
    /**
     * 关闭文案
     *
     * @type {String}
     */
    cancelText: {
      type: String,
      default: '取消',
    },
    /**
     * 确定按钮文字
     *
     * @type {String}
     */
    confirmText: {
      type: String,
      default: '确认',
    },
    /**
     * 点击确定按钮时，确定按钮是否显示 loading 状态，
     * 开启则需手动设置value来关闭对话框
     *
     * @type {Boolean}
     */
    loading: {
      type: Boolean,
      default: false,
    },
    /**
     * loading类型
     *
     * @type {String}
     */
    loadingType: {
      type: String,
      validator(value: string) {
        return oneOf(value, ['spin', 'button']);
      },
      default: 'spin',
    },
    /**
     * 弹窗到顶部的距离
     *
     * @type {Number}
     */
    top: {
      type: Number,
      default: 100,
    },
    /**
     * 再次打开时，是否重置拖拽的位置
     *
     * @type {Boolean}
     */
    resetDragPosition: {
      type: Boolean,
      default: false,
    },
    /**
     * 居中
     *
     * @type {Boolean}
     */
    center: {
      type: Boolean,
      default: false,
    },
    /**
     * 是否全屏显示
     *
     * @type {Boolean}
     */
    fullscreen: {
      type: Boolean,
      default: false,
    },
    /**
     * 不显示底部
     *
     * @type {Boolean}
     */
    footerHide: {
      type: Boolean,
      default: false,
    },
    /**
     * 是否可以拖拽移动
     *
     * @type {Boolean}
     */
    draggable: {
      type: Boolean,
      default: false,
    },
    /**
     * 拖拽时，是否吸附屏幕边缘
     *
     * @type {Boolean}
     */
    sticky: {
      type: Boolean,
      default: false,
    },
    /**
     * 拖拽时，自动吸附屏幕边缘的临界距离
     *
     * @type {Number}
     */
    stickyDistance: {
      type: Number,
      default: 10,
    },
    /**
     * 渲染函数
     *
     * @type {Function}
     */
    render: {
      type: Function,
    },
    /**
     * v-if 重新渲染body内容
     *
     * @type {Boolean}
     */
    resetBody: {
      type: Boolean,
      default: false,
    },
    /**
     * 是否禁止对页面滚动条的修改
     *
     * @type {Boolean}
     */
    lockScroll: {
      type: Boolean,
      default: true,
    },
  },
  setup(props: Props, { emit, slots }) {
    // proxy
    const { proxy, uid } = getCurrentInstance() as _ComponentInternalInstance;

    // 滚动条
    const { removeScrollEffect, addScrollEffect } = scrollbarMixins(props);

    // dom
    const headerRef = ref<HTMLElement | undefined>();
    const contentRef = ref<HTMLElement>();

    // computed

    // 外层样式
    const wrapperClasses = computed(() => {
      return [
        `${prefixCls}-wrapper`,
        {
          // 隐藏
          [`${prefixCls}-hidden`]: !data.wrapperShow,
          // 没有蒙版
          [`${prefixCls}-no-mask`]: !showMask.value,
          // 弹窗外层样式
          [`${props.modalWrapperClasses}`]: !!props.modalWrapperClasses,
          // 展示方向
          [`${prefixCls}-center`]: data.wrapperShow && props.center,
        },
      ];
    });

    // 外层样式
    const wrapperStyles = computed(() => {
      return {
        zIndex: data.modalIndex + props.zIndex,
      };
    });

    // 弹窗样式
    const modalClasses = computed(() => {
      return [
        prefixCls,
        {
          [`${prefixCls}-fullscreen`]: props.fullscreen,
          [`${prefixCls}-drag-mask`]: data.dragData.x !== null,
        },
      ];
    });

    // 弹窗样式
    const modalStyles = computed(() => {
      const width = parseInt(`${props.width}`);

      let styleWidth: {
        width?: string;
        top?: number | string;
      } = {
        width: width <= 100 ? `${width}%` : `${width}px`,
        top: !props.fullscreen && !props.center && `${props.top}px`,
      };

      // 有向左拖动
      if (data.dragData.x !== null) {
        styleWidth = {
          top: 0,
        };
      }

      return {
        ...styleWidth,
        ...props.styles,
      };
    });

    // 弹窗内容样式
    const contentClasses = computed(() => {
      return [
        `${prefixCls}-content`,
        {
          // 没有蒙版
          [`${prefixCls}-content--no-mask`]: !showMask.value,
          // 内容拖动
          [`${prefixCls}-content--drag`]: draggable.value,
          // 拖动中
          [`${prefixCls}-content--dragging`]:
            props.draggable && data.dragData.dragging,
        },
      ];
    });

    // 弹窗内容样式
    const contentStyles = computed(() => {
      let style: {
        left?: string;
        top?: string;
        width?: string;
      } = {};

      // 开启拖动没有开启全屏
      if (props.draggable && !props.fullscreen) {
        const width = parseInt(`${props.width}`);

        // width
        style = {
          width: width <= 100 ? `${width}%` : `${width}px`,
        };

        // 初始化自定义样式
        const customTop =
          props.styles && props.styles.top ? parseFloat(props.styles.top) : 0;

        // 初始化自定义样式
        const customLeft =
          props.styles && props.styles.left ? parseFloat(props.styles.left) : 0;

        // left
        if (data.dragData.x !== null) {
          style.left = `${data.dragData.x - customLeft}px`;
        }

        // top
        if (data.dragData.y !== null) {
          style.top = `${data.dragData.y - customTop}px`;
        }

        return style;
      }

      return style;
    });

    // 是否显示蒙版
    const showMask = computed(() => {
      return !props.draggable && props.mask;
    });

    // 是否显示头部
    const showHead = computed(() => {
      let showHead = true;

      if (!slots.header && !props.title) {
        showHead = false;
      }

      return showHead;
    });

    // 可以拖动
    const draggable = computed(() => {
      if (!props.draggable || props.fullscreen) {
        return false;
      }

      return true;
    });

    // methods

    // 获取弹窗zIndex
    const handleGetModalIndex = (): number => {
      modalIncrease();

      return modalIndex;
    };

    // 点击蒙版
    const handleMask = () => {
      if (props.maskClosable && showMask.value) {
        close();
      }
    };

    // 关闭方法
    const handleClose = () => {
      data.visible = false;

      // modelValue
      emit('update:modelValue', false);

      // 点击取消的回调
      emit('on-cancel');
    };

    // 关闭
    const close = () => {
      // 没有自定义关闭方法
      if (!props.beforeClose) {
        return handleClose();
      }

      // 自定义关闭方法
      const before = props.beforeClose();

      // Promise
      if (before && before.then) {
        before.then(() => {
          handleClose();
        });
      }
      // 不是Promise
      else {
        handleClose();
      }
    };

    // 弹窗外层点击
    const handleWrapperClick = (event) => {
      if (data.isMouseTriggerIn) {
        data.isMouseTriggerIn = false;

        return;
      }

      // 匹配当前点击的是不是弹窗 还是弹窗外面
      const className = event.target.getAttribute('class');

      // 点击弹窗外面
      if (className && className.indexOf(`${prefixCls}-wrapper`) > -1) {
        handleMask();
      }
    };

    // 动画结束
    const handleAfterLeave = () => {
      // 隐藏外层显示
      data.wrapperShow = false;

      // 隐藏重新渲染body
      data.resetRenderBody = false;

      // 取消loading
      setLoading(false);

      // 删除滚动条修改
      removeScrollEffect();

      // 隐藏
      emit('on-hidden');
    };

    // 鼠标按下
    const handleMousedown = () => {
      data.isMouseTriggerIn = true;
    };

    // 关闭按钮
    const handleCancel = () => {
      close();
    };

    // 确认按钮
    const handleConfirm = () => {
      // loading
      if (props.loading) {
        setLoading(true);
      }
      // 没有loading
      else {
        data.visible = false;

        emit('update:modelValue', false);
      }

      emit('on-confirm');
    };

    // 按钮关闭
    const handleEscClose = (event) => {
      // 显示 & 是否显示关闭按钮
      if (data.visible && props.closable) {
        // esc
        if (event.keyCode === 27) {
          const root = proxy.$root;

          // 显示的弹窗列表
          const visibleModals = root.modalList
            .map((item) => item.modal)
            .filter((item) => item.data.visible && item.closable);

          // 找视图当前顶层的弹窗
          const viewTopModal = visibleModals.sort((a, b) => {
            return a.data.modalIndex < b.data.modalIndex ? 1 : -1;
          })[0];

          setTimeout(() => {
            viewTopModal.close();
          }, 0);
        }
      }
    };

    // 添加实例
    const addModal = () => {
      const root = proxy.$root;

      // 初始化弹窗列表->有哪些弹窗
      if (!root.modalList) {
        root.modalList = [];
      }

      // 添加当前实例
      root.modalList.push({
        id: uid,
        modal: proxy,
      });
    };

    // 删除实例
    const removeModal = () => {
      const root = proxy.$root;

      if (!root.modalList) {
        return;
      }

      const index = root.modalList.findIndex((item) => item.id === uid);

      // 删除当前弹窗
      root.modalList.splice(index, 1);
    };

    // 设置loading
    const setLoading = (value: boolean) => {
      // spin
      if (props.loadingType === 'spin') {
        data.spinLoading = value;
      }

      // button
      if (props.loadingType === 'button') {
        data.buttonLoading = value;
      }
    };

    // 点击弹窗
    const handleClickModal = () => {
      // 重新设置当前弹窗的 zIndex
      if (props.draggable) {
        // 重复点击
        if (currentUid === uid) {
          return;
        }

        // 设置当前点击的uid
        setCurrentUid(uid);

        // 设置zIndex
        data.modalIndex = handleGetModalIndex();
      }
    };

    // data
    const data = reactive<Data>({
      /**
       * 显示/隐藏
       *
       * @type {Boolean}
       */
      visible: props.modelValue,
      /**
       * 弹窗zIndex
       *
       * @type {Number}
       */
      modalIndex: handleGetModalIndex(),
      /**
       * 外层显示
       *
       * @type {Boolean}
       */
      wrapperShow: false,
      /**
       * 鼠标点击
       *
       * @type {Boolean}
       */
      isMouseTriggerIn: false,
      /**
       * setTimeout
       *
       * @type  {Function}
       */
      timer: null,
      /**
       * 之前是否已经显示过
       *
       * @type {Boolean}
       */
      lastVisible: false,
      /**
       * 拖动的数据
       *
       * @type {Object}
       */
      dragData: deepCopy(dragData),
      /**
       * 使用spain
       *
       * @type {Boolean}
       */
      spinLoading: false,
      /**
       * 按钮loading
       *
       * @type {Boolean}
       */
      buttonLoading: false,
      /**
       * 重新渲染body
       *
       * @type {Boolean}
       */
      resetRenderBody: false,
    });

    // watch

    // 监听modelValue
    watch(
      () => props.modelValue,
      (value) => {
        data.visible = value;

        // 显示重新渲染body
        if (value) {
          data.resetRenderBody = value;
        }
      }
    );

    // 监听显示/隐藏
    watch(
      () => data.visible,
      (value) => {
        // 显示
        if (value) {
          // 增加 zIndex
          if (data.lastVisible !== value) {
            data.modalIndex = handleGetModalIndex();
          }

          // 清除setTimeout
          if (data.timer) {
            clearTimeout(data.timer);

            data.timer = null;
          }

          // 外层显示
          data.wrapperShow = true;

          // 页面是否可以滚动
          if (!props.scrollable) {
            addScrollEffect();
          }
        }

        // 显示状态发生变化时触发
        emit('on-visible-change', value);

        // 之前是否已经显示过
        data.lastVisible = value;

        // 拖动的数据用于重新设置初始化拖动位置
        if (value && props.resetDragPosition) {
          data.dragData.x = null;
          data.dragData.y = null;
          data.dragData.dragX = null;
          data.dragData.dragY = null;
          data.dragData.dragging = false;
          data.dragData.rect = null;
        }
      }
    );

    // 监听loading
    watch(
      () => props.loading,
      (value) => {
        if (!value) {
          // 取消loading
          setLoading(false);
        }
      }
    );

    // 监听页面是否可以滚动
    watch(
      () => props.scrollable,
      (value) => {
        // 页面是否可以滚动
        if (!value) {
          addScrollEffect();
        }
        // 删除滚动条修改
        else {
          removeScrollEffect();
        }
      }
    );

    // onMounted
    onMounted(() => {
      // 显示
      if (data.visible) {
        // 外层显示
        data.wrapperShow = true;
      }

      // 添加实例 to root 用于 esc close
      addModal();

      // 键盘事件
      useEventListener(window, 'keydown', handleEscClose);

      // 拖动
      if (showHead.value) {
        useDraggable(contentRef, headerRef, data.dragData, draggable, {
          sticky: props.sticky,
          stickyDistance: props.stickyDistance,
        });
      }
    });

    // onBeforeUnmount
    onBeforeUnmount(() => {
      // 删除实例
      removeModal();

      // 删除滚动条修改
      removeScrollEffect();
    });

    return {
      prefixCls,

      // dom
      headerRef,
      contentRef,

      // data
      data,

      // computed
      wrapperClasses,
      wrapperStyles,
      modalClasses,
      modalStyles,
      contentClasses,
      contentStyles,
      showMask,
      showHead,

      // methods
      close,
      setLoading,
      handleMask,
      handleWrapperClick,
      handleAfterLeave,
      handleMousedown,
      handleCancel,
      handleConfirm,
      handleClickModal,
    };
  },
  components: {
    IvueIcon,
    IvueButton,
    IvueSpin,
  },
});
</script>
