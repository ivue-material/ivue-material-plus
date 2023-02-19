import { ref, onUnmounted, inject, onMounted, getCurrentInstance } from 'vue';

import {
  BottomNavContextKey,
  BottomNavContext,
} from '@ivue-material-plus/tokens';
import { BottomNavItemInstance } from './bottom-nav-item';

// type
import type { ComponentInternalInstance } from 'vue';
import type { BottomNavItemProps } from './bottom-nav-item';

export const useBottomNavItem = (props: BottomNavItemProps) => {
  const { proxy, uid } = getCurrentInstance() as ComponentInternalInstance;

  // inject
  const { addItem, removeItem, updateValue } = inject(
    BottomNavContextKey
  ) as BottomNavContext;

  // data

  // 按钮是否激活状态
  const isActive = ref<boolean>(false);

  // methods

  // 点击选项
  const handleClick = () => {
    updateValue(props.name);
  };

  // onMounted
  onMounted(() => {
    addItem(proxy as BottomNavItemInstance);
  });

  // onUnmounted
  onUnmounted(() => {
    removeItem(uid);
  });

  return {
    // data
    isActive,
    uid,

    // methods
    handleClick,
  };
};
