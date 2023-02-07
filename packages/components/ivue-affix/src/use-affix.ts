import {
  ref,
  unref,
  computed,
  watch,
  onMounted,
  nextTick,
  onUnmounted,
} from 'vue';
import throttle from 'lodash.throttle';
import { useEventListener } from '@vueuse/core';

import { AffixStatus } from './affix';
import {
  getTargetRect,
  getFixedTop,
  getFixedBottom,
  getDefaultTarget,
} from './utils';

// type
import type { SetupContext } from 'vue';
import type {
  AffixProps,
  AffixEmits,
  AffixState,
  AffixStyle,
  PlaceholderStyle,
} from './affix';

export const useAffix = (
  props: AffixProps,
  emit: SetupContext<AffixEmits>['emit']
) => {
  // ref
  const wrapper = ref<HTMLDivElement>();
  const content = ref<HTMLDivElement>();

  // 可以执行更新位置
  const status = ref<AffixStatus | undefined>(AffixStatus.None);
  // 是否固定
  const fixed = ref<boolean>(false);
  // 初始化固定样式
  const affixStyle = ref<AffixStyle | undefined>(undefined);
  // 初始化占位样式
  const placeholderStyle = ref<PlaceholderStyle | undefined>(undefined);

  // computed

  // 获取滚动顶部固定位置
  const getOffsetTop = computed(() => {
    const { offsetBottom, offsetTop } = props;

    return offsetBottom === undefined && offsetTop === undefined
      ? 0
      : offsetTop;
  });

  // method

  // 初始化数据
  const initData = () => {
    // 可以执行更新位置
    status.value = AffixStatus.Start;
    // 初始化固定样式
    affixStyle.value = undefined;
    // 初始化占位样式
    placeholderStyle.value = undefined;
  };

  // 获取目标节点默认 window
  const getTarget = () => {
    const { target } = props;

    // 有设置自定义 target
    if (target !== undefined) {
      return target;
    }

    // 有外部配置滚动监听容器
    return getDefaultTarget();
  };

  // 节流更新位置
  const lazyUpdatePosition = throttle(() => {
    const targetNode = getTarget();

    const _affixStyle = unref(affixStyle);

    // 在测量之前检查位置变化以使 Safari 流畅
    if (targetNode && _affixStyle) {
      const offsetTop = unref(getOffsetTop);
      const offsetBottom = props.offsetBottom;

      // 是否有占位节点
      if (targetNode && unref(wrapper)) {
        // 获取目标节点的元素大小及其相对于视口的位置的信息
        const targetRect = getTargetRect(targetNode);
        // 获取占位节点的元素大小及其相对于视口的位置的信息
        const placeholderReact = getTargetRect(unref(wrapper));
        // 固定的顶部
        const fixedTop = getFixedTop(placeholderReact, targetRect, offsetTop);
        // 固定到底部
        const fixedBottom = getFixedBottom(
          placeholderReact,
          targetRect,
          offsetBottom
        );

        // 有固定到顶部 || 有固定到底部
        if (
          (fixedTop !== undefined && _affixStyle.top === `${fixedTop}px`) ||
          (fixedBottom !== undefined &&
            _affixStyle.bottom === `${fixedBottom}px`)
        ) {
          return;
        }
      }
    }

    // 初始化数据
    initData();

    // 计算滚动位置
    calculateScrollPosition();
  });

  // 计算滚动位置
  const calculateScrollPosition = () => {
    // 获取目标节点
    const targetNode = getTarget();

    // status !== Start || 没有固定节点 || 没有外层 || 没有目标节点
    if (
      unref(status) !== AffixStatus.Start ||
      !unref(content) ||
      !unref(wrapper) ||
      !targetNode
    ) {
      return;
    }

    // 获取滚动顶部固定位置
    const offsetTop = getOffsetTop.value;
    // 获取滚动到底部固定位置
    const offsetBottom = props.offsetBottom;

    // 没有目标元素
    if (!targetNode) {
      return;
    }

    // 设置为不能执行，等待节流方法执行
    const newState: Partial<AffixState> = {
      status: AffixStatus.None,
    };

    //  获取目标节点的元素大小及其相对于视口的位置的信息
    const targetRect = getTargetRect(targetNode);
    // 获取占位节点的元素大小及其相对于视口的位置的信息
    const wrapperRect = getTargetRect(unref(wrapper));

    // 固定的顶部
    const fixedTop = getFixedTop(wrapperRect, targetRect, offsetTop);
    // 固定到底部
    const fixedBottom = getFixedBottom(wrapperRect, targetRect, offsetBottom);

    // 已经固定了不执行
    if (
      wrapperRect.top === 0 &&
      wrapperRect.left === 0 &&
      wrapperRect.width === 0 &&
      wrapperRect.height === 0
    ) {
      return;
    }

    // 固定顶部 || 固定底部
    if (fixedTop !== undefined || fixedBottom !== undefined) {
      // 节点固定
      newState.affixStyle = {
        width: `${wrapperRect.width}px`,
        height: `${wrapperRect.height}px`,
      };

      // 设置占位节点尺寸
      newState.placeholderStyle = {
        width: `${wrapperRect.width}px`,
        height: `${wrapperRect.height}px`,
      };

      // 有固定到顶部数值
      if (fixedTop !== undefined) {
        newState.affixStyle.top = `${fixedTop}px`;
      }

      // 有固定到底部数组
      if (fixedBottom !== undefined) {
        newState.affixStyle.bottom = `${fixedBottom}px`;
      }
    }

    // 有设置元素固定节点
    newState.fixed = !!newState.affixStyle;

    // 发送监听事件
    if (unref(fixed) !== newState.fixed) {
      emit('on-change', newState.fixed);
    }

    // 可以执行更新位置
    status.value = newState.status;
    // 初始化固定样式
    affixStyle.value = newState.affixStyle;
    // 初始化占位样式
    placeholderStyle.value = newState.placeholderStyle;
    // 是否固定
    fixed.value = newState.fixed;
  };

  // watch

  // 监听距离窗口顶部达到指定偏移量后触发
  watch(
    () => props.offsetTop,
    () => {
      lazyUpdatePosition();
    }
  );

  // 监听距离窗口底部达到指定偏移量后触发
  watch(
    () => props.offsetBottom,
    () => {
      lazyUpdatePosition();
    }
  );

  // mounted
  onMounted(async () => {
    await nextTick();

    // 节流初始化
    lazyUpdatePosition();

    // 目标节点
    const targetNode = getTarget();

    // 缩放
    useEventListener(
      targetNode,
      'resize',
      lazyUpdatePosition,
      props.useCapture
    );

    // 滚动
    useEventListener(
      targetNode,
      'scroll',
      lazyUpdatePosition,
      props.useCapture
    );
  });

  // onUnmounted
  onUnmounted(() => {
    // 节流更新位置
    lazyUpdatePosition.cancel();
  });

  return {
    // ref
    wrapper,
    content,

    // data
    status,
    fixed,
    affixStyle,
    placeholderStyle,

    // methods
    initData,
    getTarget,
    lazyUpdatePosition,
  };
};
