import { nextTick } from 'vue';
import Popper from 'popper.js/dist/umd/popper.js';

export default {
  emits: ['on-popper-show', 'on-popper-hide', 'on-created', 'update:modelValue'],
  props: {
    reference: Object,
    popper: Object,
    /**
    * 是否开启 Popper 的 eventsEnabled 属性，开启可能会牺牲一定的性能
    *
    * @type {Boolean}
    */
    eventsEnabled: {
      type: Boolean,
      default: false,
    },
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
     * 箭头当前间距
     *
     * @type {Number}
     */
    offset: {
      default: 0
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
          modifiers: {
            computeStyle: {
              gpuAcceleration: false,
            },
            preventOverflow: {
              boundariesElement: 'window'
            }
          }
        };
      }
    },
  },
  data() {
    return {
      /**
       * 显示隐藏
       *
       * @type {Boolean}
       */
      visible: this.modelValue
    }
  },
  // 在数据更改导致的虚拟 DOM 重新渲染和更新完毕之后被调用。
  updated() {
    nextTick(() => {
      this.updatePopper()
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
      if (this.popperJS && this.popperJS.hasOwnProperty('destroy')) {
        this.popperJS.destroy();
      }

      // 是否开启 Popper 的 eventsEnabled 属性，开启可能会牺牲一定的性能
      options.eventsEnabled = this.eventsEnabled;

      // 方向
      options.placement = this.placement;

      // 箭头当前与参考重叠，我们可以使用修改器给它一个距离offset
      if (!options.modifiers.offset) {
        options.modifiers.offset = {};
      }
      options.modifiers.offset.offset = this.offset;

      // 创建
      options.onCreate = () => {
        nextTick(this.updatePopper);

        this.$emit('on-created', this);
      };

      this.popperJS = new Popper(reference, popper, options);

    },
    // 更新
    updatePopper() {
      this.popperJS ? this.popperJS.update() : this.createPopper();
    },
    // 销毁
    popperDestroy() {
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
      handler(val) {
        this.visible = val;

        this.$emit('update:modelValue', val);
      }
    },
    // 显示隐藏
    visible(val) {
      if (val) {
        this.updatePopper();

        this.$emit('on-popper-show');
      } else {
        this.$emit('on-popper-hide');
      }
      this.$emit('update:modelValue', val);
    }
  },
}
