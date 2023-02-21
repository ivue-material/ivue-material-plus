import { onMounted, ref, shallowRef } from 'vue';
import { useEventListener } from '@vueuse/core';
import { isClient } from '@ivue-material-plus/utils';
import { scrollTop } from './utils';

// type
import type { SetupContext } from 'vue';
import type { BackTopProps, BackTopEmits } from './back-top';

export const useBackTop = (
  props: BackTopProps,
  emit: SetupContext<BackTopEmits>['emit']
) => {
  // 容器
  const container = shallowRef<Document | HTMLElement>();

  // documentElement
  const el = shallowRef<HTMLElement>(document.documentElement);

  // 是否可以显示滚动顶部
  const backTop = ref<boolean>(false);

  // methods

  // 监听滚动
  const handleScroll = () => {
    if (!isClient) {
      return;
    }

    // 显示滚动顶部
    if (el.value) {
      backTop.value = el.value.scrollTop >= props.visibilityHeight;
    }
  };

  // 滚动到顶部
  const handleScrollTop = () => {
    // emit
    emit('on-click');

    // 滚动到顶部
    scrollTop(
      el.value,
      el.value!.scrollTop,
      0,
      props.duration,
      handleScrollEnd
    );
  };

  // 滚动结束回调
  const handleScrollEnd = () => {
    emit('on-scroll-end');
  };

  // onMounted
  onMounted(() => {
    container.value = document;
    el.value = document.documentElement;

    if (props.target) {
      el.value =
        document.querySelector<HTMLElement>(props.target) ?? (undefined as any);

      // 没有找到节点
      if (!el.value) {
        throw `target is not existed: ${props.target}`;
      }

      container.value = el.value;
    }

    // 设置滚动
    useEventListener(container, 'scroll', handleScroll);
  });

  return {
    // data
    backTop,

    // methods
    handleScrollTop,
  };
};
