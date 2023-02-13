import {
  nextTick,
  defineComponent,
  onUpdated,
  onBeforeUnmount,
  ref,
  unref,
  getCurrentInstance,
  watch,
} from 'vue';
import { isBoolean } from '@vueuse/core';
import { createPopper as create } from '@popperjs/core';

import type {
  ExtractPropTypes,
  SetupContext,
  ComponentInternalInstance,
  Ref,
} from 'vue';
import type { Instance } from '@popperjs/core';

// props
export const popperProps = {
  reference: {
    type: Object,
  },
  popper: {
    type: Object,
  },
  /**
   * 弹窗的展开方向
   *
   * @type {String}
   */
  placement: {
    type: String,
    default: 'bottom',
  },
  /**
   * 箭头当前间距 左右 上下
   *
   * @type {Array}
   */
  offset: {
    default: [0, 0],
  },
  /**
   * 显示隐藏
   *
   * @type {Boolean}
   */
  modelValue: {
    type: Boolean,
    default: false,
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
    },
  },
};

// props 类型
export type PopoverProps = ExtractPropTypes<typeof popperProps>;

// data
export type PopoverData = {
  visible: Ref<boolean>;
  handleIndexIncrease: () => void;
};

// emits事件类型
export const popperEmits = {
  'on-created': (value: any) => value,
  'on-popper-show': () => true,
  'on-popper-hide': () => true,
  'update:modelValue': (value: boolean) => isBoolean(value),
};
export type PopperEmits = typeof popperEmits;

// poper
export const popper = (
  props: PopoverProps,
  data: PopoverData,
  emit: SetupContext<PopperEmits>['emit']
) => {
  // vm
  const { proxy } = getCurrentInstance() as ComponentInternalInstance;

  // dom
  const popperRef = ref<HTMLElement>();
  const referenceRef = ref<HTMLElement>();

  // popperJS
  const popperJS = ref<Instance | undefined>();

  // methods

  // 创建pppper
  const createPopper = () => {
    // 位置
    if (!/^(top|bottom|left|right)(-start|-end)?$/g.test(props.placement)) {
      return;
    }

    // 选项
    const options = props.options;

    // 节点
    const popper = (props.popper as HTMLElement) || unref(popperRef);
    // 参考位置
    const _reference = (props.reference as HTMLElement) || unref(referenceRef);

    if (!popper || !_reference) return;

    // 销毁
    // eslint-disable-next-line no-prototype-builtins
    if (unref(popperJS) && unref(popperJS)?.hasOwnProperty('destroy')) {
      unref(popperJS)?.destroy();
    }

    // 方向
    options.placement = props.placement;

    // 箭头当前与参考重叠，我们可以使用修改器给它一个距离offset
    if (!options.modifiers[3]) {
      options.modifiers[3] = {
        name: 'offset',
        options: {
          offset: props.offset,
        },
      };
    }

    // 创建
    options.onFirstUpdate = () => {
      nextTick(() => {
        updatePopper();
      });

      emit('on-created', proxy);
    };

    popperJS.value = create(_reference, popper, options);
  };

  // 更新
  const updatePopper = () => {
    unref(popperJS) ? unref(popperJS)?.update() : createPopper();
  };

  // 销毁
  const popperDestroy = () => {
    // 显示
    if (unref(data.visible)) {
      return;
    }

    unref(popperJS)?.destroy();
    popperJS.value = undefined;
  };

  // watch

  // 显示隐藏
  watch(
    () => props.modelValue,
    (value) => {
      data.visible.value = value;

      emit('update:modelValue', value);
    },
    {
      immediate: true,
    }
  );

  // 显示隐藏
  watch(
    () => unref(data.visible),
    (value: boolean) => {
      // 显示
      if (value) {
        // 增加zIndex
        if (data.handleIndexIncrease) {
          data.handleIndexIncrease();
        }

        // 更新
        updatePopper();

        emit('on-popper-show');
      }
      // 隐藏
      else {
        emit('on-popper-hide');
      }

      // update
      emit('update:modelValue', value);
    },
    {
      immediate: true,
    }
  );

  // 在数据更改导致的虚拟 DOM 重新渲染和更新完毕之后被调用。
  onUpdated(() => {
    nextTick(() => {
      updatePopper();
    });
  });

  // 销毁
  onBeforeUnmount(() => {
    if (unref(popperJS)) {
      unref(popperJS)?.destroy();
    }
  });

  return {
    // dom
    popperRef,
    referenceRef,

    // methods
    popperDestroy,
  };
};

export type { Placement } from '@popperjs/core';
