import { ref } from 'vue';
import { getScrollBarSize } from '../../utils/helpers';
import { isClient } from '../../utils/helpers';

export const scrollbarMixins = ({ lockScroll = true }) => {
  // body是否可以滚动
  const bodyIsOverflowing = ref<boolean>(false);

  // 滚动条宽度
  const scrollBarWidth = ref<number>(0);

  // methods

  // 检查滚动条
  const checkScrollBar = () => {
    if (!isClient) {
      return;
    }

    let fullWindowWidth = window.innerWidth;

    // workaround for missing window.innerWidth in IE8
    if (!fullWindowWidth) {
      // 元素的大小及其相对于视口的位置
      const documentElementRect =
        document.documentElement.getBoundingClientRect();

      // 视口宽度
      fullWindowWidth =
        documentElementRect.right - Math.abs(documentElementRect.left);
    }

    // body是否有滚动条
    bodyIsOverflowing.value = document.body.clientWidth < fullWindowWidth;

    // 有滚动条
    if (bodyIsOverflowing.value) {
      // 获取滚动条宽度
      scrollBarWidth.value = getScrollBarSize();
    }
  };

  // 检查是否有蒙版
  const checkMaskInVisible = () => {
    if (!isClient) {
      return;
    }

    const masks = document.getElementsByClassName('ivue-modal-mask') || [];

    // 是否存在蒙版
    return Array.from(masks).every(
      (m) => m.style.display === 'none' || m.classList.contains('fade-leave-to')
    );
  };

  // 重新设置滚动条
  const resetScrollBar = () => {
    if (!isClient) {
      return;
    }

    document.body.style.paddingRight = '';
  };

  // 设置滚动条
  const setScrollBar = () => {
    if (!isClient) {
      return;
    }

    // body可以滚动 有滚动条宽度
    if (bodyIsOverflowing.value && scrollBarWidth.value !== undefined) {
      document.body.style.paddingRight = `${scrollBarWidth.value}px`;
    }
  };

  // 添加滚动条
  const addScrollEffect = () => {
    if (!isClient) {
      return;
    }

    // 禁止对页面滚动条的修改
    if (!lockScroll) {
      return;
    }

    // 检查滚动条
    checkScrollBar();
    // 设置滚动条
    setScrollBar();

    document.body.style.overflow = 'hidden';
  };

  // 删除滚动条修改
  const removeScrollEffect = () => {
    // 禁止对页面滚动条的修改
    if (!lockScroll) {
      return;
    }

    // 没有蒙版
    if (isClient && checkMaskInVisible()) {
      // 重新设置 body overflow
      document.body.style.overflow = '';

      resetScrollBar();
    }
  };

  return {
    checkScrollBar,
    checkMaskInVisible,
    resetScrollBar,
    setScrollBar,
    addScrollEffect,
    removeScrollEffect,
  };
};
