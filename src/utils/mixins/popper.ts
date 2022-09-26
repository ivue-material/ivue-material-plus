import { nextTick } from 'vue';
import { createPopper } from '@popperjs/core';

export default {
  emits: ['on-popper-show', 'on-popper-hide', 'on-created', 'update:modelValue'],
  props: {
    reference: Object,
    popper: Object,
    /**
     * 弹窗的展开方向
     *
     * @type {String}
     */
    placement: {
      type: String,
      default: 'bottom'
    },
    /**
     * 箭头当前间距 左右 上下
     *
     * @type {Array}
     */
    offset: {
      default: [0, 0]
    },
    /**
     * 显示隐藏
     *
     * @type {Boolean}
     */
    modelValue: {
      type: Boolean,
      default: false
    },
    /**
     * 动画
     *
     * @type {String}
     */
    transition: String,
    /**
     * 默认选项
     *
     * @type {Object}
     */
    options: {
      type: Object,
      default() {
        return {
          modifiers: [
            // 这决定了是否使用 GPU 加速样式来定位 popper
            {
              name: 'computeStyles',
              options: {
                gpuAcceleration: false, // true by default
              },
            },
            //检测溢出
            {
              name: 'preventOverflow',
              options: {
                rootBoundary: 'viewport',
              },
            },
          ],
        };
      }
    },
  },
  // 在数据更改导致的虚拟 DOM 重新渲染和更新完毕之后被调用。
  updated() {
    nextTick(() => {
      this.updatePopper();
    });
  },
  // 销毁
  beforeUnmount() {
    if (this.popperJS) {
      this.popperJS.destroy();
    }
  },
  methods: {
    // 创建pppper
    createPopper() {
      // 位置
      if (!/^(top|bottom|left|right)(-start|-end)?$/g.test(this.placement)) {
        return;
      }

      // 选项
      const options = this.options;

      // 节点
      const popper = this.popper || this.$refs.popper;
      // 参考位置
      const reference = this.reference || this.$refs.reference;

      if (!popper || !reference) return;

      // 销毁
      // eslint-disable-next-line no-prototype-builtins
      if (this.popperJS && this.popperJS.hasOwnProperty('destroy')) {
        this.popperJS.destroy();
      }

      // 方向
      options.placement = this.placement;

      // 箭头当前与参考重叠，我们可以使用修改器给它一个距离offset
      if (!options.modifiers[3]) {
        options.modifiers[3] = {
          name: 'offset',
          options: {
            offset: this.offset,
          },
        };
      }

      // 创建
      options.onFirstUpdate = () => {
        nextTick(this.updatePopper);

        this.$emit('on-created', this);
      };


      this.popperJS = createPopper(reference, popper, options);
    },
    // 更新
    updatePopper() {
      this.popperJS ? this.popperJS.update() : this.createPopper();
    },
    // 销毁
    popperDestroy() {
      // 显示
      if (this.visible) {
        return;
      }

      this.popperJS.destroy();
      this.popperJS = null;
    }
  },
  watch: {
    // 显示隐藏
    modelValue: {
      immediate: true,
      handler(val: boolean) {
        this.visible = val;

        this.$emit('update:modelValue', val);
      }
    },
    // 显示隐藏
    visible(value: boolean) {
      // 显示
      if (value) {
        // 增加zIndex
        if (this.handleIndexIncrease) {
          this.handleIndexIncrease();
        }

        // 更新
        this.updatePopper();

        this.$emit('on-popper-show');
      }
      // 隐藏
      else {
        this.$emit('on-popper-hide');
      }

      // update
      this.$emit('update:modelValue', value);
    }
  },
};
