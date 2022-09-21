import { getScrollBarSize } from '../../utils/helpers';
import { isClient } from '../../utils/helpers';

export default {
  props: {
    /**
     * 是否禁止对页面滚动条的修改
     *
     * @type {Boolean}
     */
    lockScroll: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      /**
       * body是否可以滚动
       *
       * @type {Boolean}
       */
      bodyIsOverflowing: false,
      /**
       * 滚动条宽度
       *
       * @type {Boolean}
       */
      scrollBarWidth: false
    };
  },
  methods: {
    // 检查滚动条
    checkScrollBar() {
      if (!isClient) {
        return;
      }

      let fullWindowWidth = window.innerWidth;

      // workaround for missing window.innerWidth in IE8
      if (!fullWindowWidth) {
        // 元素的大小及其相对于视口的位置
        const documentElementRect = document.documentElement.getBoundingClientRect();

        // 视口宽度
        fullWindowWidth = documentElementRect.right - Math.abs(documentElementRect.left);
      }

      // body是否有滚动条
      this.bodyIsOverflowing = document.body.clientWidth < fullWindowWidth;

      // 有滚动条
      if (this.bodyIsOverflowing) {
        // 获取滚动条大小
        this.scrollBarWidth = getScrollBarSize();
      }

    },
    // 检查是否有蒙版
    checkMaskInVisible() {
      if (!isClient) {
        return;
      }

      const masks = document.getElementsByClassName('ivue-modal-mask') || [];

      // 是否存在蒙版
      return Array.from(masks).every((m) => m.style.display === 'none' || m.classList.contains('fade-leave-to'));
    },
    // 重新设置滚动条
    resetScrollBar() {
      if (!isClient) {
        return;
      }

      document.body.style.paddingRight = '';
    },
    // 设置滚动条
    setScrollBar() {
      if (!isClient) {
        return;
      }

      // body可以滚动 有滚动条宽度
      if (this.bodyIsOverflowing && this.scrollBarWidth !== undefined) {
        document.body.style.paddingRight = `${this.scrollBarWidth}px`;
      }
    },
    // 添加滚动条
    addScrollEffect() {
      if (!isClient) {
        return;
      }

      // 禁止对页面滚动条的修改
      if (!this.lockScroll) {
        return;
      }

      this.checkScrollBar();
      this.setScrollBar();

      document.body.style.overflow = 'hidden';
    },
    // 删除滚动条修改
    removeScrollEffect() {
      // 禁止对页面滚动条的修改
      if (!this.lockScroll) {
        return;
      }

      // 没有蒙版
      if (isClient && this.checkMaskInVisible()) {
        // 重新设置 body overflow
        document.body.style.overflow = '';

        this.resetScrollBar();
      }
    }
  }
};
