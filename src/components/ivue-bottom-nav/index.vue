<script lang="ts">
import {
  defineComponent,
  h,
  reactive,
  computed,
  onMounted,
  watch,
  provide,
} from 'vue';

import { colorable } from '../../utils/mixins/colorable';
import { oneOf } from '../../utils/assist';

// type
import {
  BottomNavContextKey,
  BottomNavItemInstance,
} from '../ivue-bottom-nav-item/types/bottom-nav-item';
import type { Props, Data } from './types/bottom-nav';

const prefixCls = 'ivue-bottom-nav';

export default defineComponent({
  name: prefixCls,
  // 声明事件
  emits: ['update:modelValue', 'on-change'],
  props: {
    /**
     * 当前激活的导航
     *
     * @type {Number, String}
     */
    modelValue: {
      type: [Number, String],
      default: null,
    },
    /**
     * 设置组件高度
     *
     * @type {Number, String}
     */
    height: {
      type: [Number, String],
      default: 56,
    },
    /**
     * 是否隐藏
     *
     * @type {Boolean}
     */
    visible: {
      type: Boolean,
      default: true,
    },
    /**
     * 导航栏固定位置
     *
     * @type {String}
     */
    position: {
      type: String,
      validator(value: string) {
        return oneOf(value, ['fixed', 'absolute']);
      },
    },
    /**
     * 不是激活状态时隐藏按钮上的文字
     *
     * @type {Boolean}
     */
    shift: {
      type: Boolean,
      default: false,
    },
    /**
     * 导航缩放效果
     *
     * @type {Boolean}
     */
    scale: {
      type: Boolean,
      default: false,
    },
    /**
     * 颜色
     *
     * @type {String | Array}
     */
    color: {
      type: [String, Array],
      default: '',
    },
  },
  setup(props: Props, { emit }) {
    const { setBackgroundColor } = colorable(props);

    // data
    const data = reactive<Data>({
      // 导航数组
      items: [],
    });

    // computed

    // class
    const classes = computed(() => {
      return {
        // 导航栏固定位置 position
        [`${prefixCls}--absolute`]: props.position === 'absolute',
        // 导航栏固定位置 fixed
        [`${prefixCls}--fixed`]: props.position === 'fixed',
        // 控制可见性
        [`${prefixCls}--active`]: props.visible,
        // 导航缩放效果
        [`${prefixCls}--active__scale`]: props.visible && props.scale,
        // 不是激活状态时隐藏按钮上的文字
        [`${prefixCls}--shift`]: props.shift,
      };
    });

    // 实时计算高度
    const computedHeight = computed(() => {
      return !Number.isNaN(Number(props.height))
        ? `${props.height}px`
        : props.height;
    });

    // methods

    // 更新数据
    const update = () => {
      for (let i = 0; i < data.items.length; i++) {
        const button = data.items[i];

        // 记录选择项

        // 激活
        if (isSelected(i)) {
          button.data.isActive = true;
        }
        // 没有激活
        else {
          button.data.isActive = false;
        }
      }
    };

    // 更新当前激活的导航
    const updateValue = (value: number | string) => {
      // updated v-model
      emit('update:modelValue', value);
    };

    // 获取button index
    const getValue = (i: number) => {
      if (data.items[i].name != null) {
        return data.items[i].name;
      }

      return i;
    };

    // 判断是否选中
    const isSelected = (i: number) => {
      const index = getValue(i);

      return props.modelValue === index;
    };

    // 添加选项
    const addItem = (item: BottomNavItemInstance) => {
      data.items.push(item);
    };

    // 删除选项
    const removeItem = (uid?: number) => {
      const index = data.items.findIndex((item) => item.uid === uid);

      // 删除
      if (index !== -1) {
        data.items.splice(index, 1);
      }
    };

    // watch

    // 监听变化
    watch(
      () => props.modelValue,
      (value) => {
        update();

        emit('on-change', value);
      }
    );

    // 监听按钮导航数组
    watch(
      () => data.items,
      () => {
        // 初始化
        update();
      }
    );

    // provide
    provide(BottomNavContextKey, {
      addItem,
      removeItem,
      updateValue,
    });

    // onMounted
    onMounted(() => {
      // 初始化
      update();
    });

    return {
      // data
      data,

      // computed
      classes,
      computedHeight,

      // methods
      updateValue,
      setBackgroundColor,
    };
  },
  render() {
    return h(
      'div',
      this.setBackgroundColor(this.color, {
        class: {
          [`${prefixCls}`]: true,
          ...this.classes,
        },
        style: {
          height: `${this.computedHeight}`,
          transform: `translate3d(0, ${
            this.visible ? 0 : `calc(${this.computedHeight} + 4px)`
          }, 0)`,
        },
      }),
      // 插槽
      this.$slots && this.$slots?.default?.()
    );
  },
});
</script>
