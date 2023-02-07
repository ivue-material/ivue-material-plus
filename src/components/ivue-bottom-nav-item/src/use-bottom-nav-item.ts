import { ref, onUnmounted, inject, onMounted, getCurrentInstance } from 'vue';

import { BottomNavContextKey } from './bottom-nav-item';

// type
import type { BottomNavItemProps } from './bottom-nav-item';

export const useBottomNavItem = (props: BottomNavItemProps) => {
  const { proxy, uid } = getCurrentInstance();

  // inject
  const { addItem, removeItem, updateValue } = inject(BottomNavContextKey);

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
    addItem(proxy);
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
