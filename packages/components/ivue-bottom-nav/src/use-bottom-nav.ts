import { ref, unref, watch, provide, onMounted } from 'vue';

// type
import type { SetupContext } from 'vue';
import type { BottomNavProps, BottomNavEmits } from './bottom-nav';

// type
import { BottomNavContextKey } from '@ivue-material-plus/tokens';
import { BottomNavItemInstance } from '@ivue-material-plus/components/ivue-bottom-nav-item';

export const useBottomBav = (
  props: BottomNavProps,
  emit: SetupContext<BottomNavEmits>['emit']
) => {
  // 导航数组
  const items = ref<BottomNavItemInstance[]>([]);

  // methods

  // 更新数据
  const update = () => {
    unref(items).forEach((item, index) => {
      // 记录选择项

      // 激活
      if (isSelected(index)) {
        item.isActive = true;
      }
      // 没有激活
      else {
        item.isActive = false;
      }
    });
  };

  // 判断是否选中
  const isSelected = (i: number) => {
    const index = getValue(i);

    return props.modelValue === index;
  };

  // 获取button index
  const getValue = (i: number) => {
    const _items = unref(items);

    // 返回 item name
    if (_items[i].name != null) {
      return _items[i].name;
    }

    return i;
  };

  // 更新当前激活的导航
  const updateValue = (value: number | string) => {
    // updated v-model
    emit('update:modelValue', value);
  };

  // 添加选项
  const addItem = (item: BottomNavItemInstance) => {
    items.value.push(item);
  };

  // 删除选项
  const removeItem = (uid?: number) => {
    const index = unref(items).findIndex((item) => item.uid === uid);

    // 删除
    if (index !== -1) {
      items.value.splice(index, 1);
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
    () => unref(items),
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
    items,

    // methods
    updateValue,
  };
};
