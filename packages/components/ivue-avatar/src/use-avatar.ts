import { ref, unref, onMounted, watch, nextTick, onUpdated } from 'vue';

// type
import type { AvatarProps, AvatarEmits } from './avatar';
import type { ComponentInternalInstance, SetupContext } from 'vue';

export const useAvatar = (
  props: AvatarProps,
  emit: SetupContext<AvatarEmits>['emit'],
  slots: ComponentInternalInstance['slots']
) => {
  // dom
  const text = ref<HTMLDivElement>();
  const wrapper = ref<HTMLDivElement>();

  // data

  // 是否显示slot
  const isSlotShow = ref<boolean>(false);
  // slot缩放大小
  const slotScale = ref<number>(1);
  // slot宽度
  const slotWidth = ref<number>(0);

  // methods

  // 图片加载错误
  const handleImageError = (event: Event) => {
    emit('on-error', event);
  };

  // 文字缩放
  const setTextScale = () => {
    isSlotShow.value = !props.src && !props.icon && !slots.src && !slots.icon;

    // 有默认插槽
    if (text.value) {
      // 获取slot宽度
      slotWidth.value = text.value.offsetWidth;
      // 获取父级宽度
      const fatherWidth = wrapper.value.getBoundingClientRect().width;

      // 计算缩放大小
      if (fatherWidth - 8 < unref(slotWidth)) {
        slotScale.value = (fatherWidth - 8) / unref(slotWidth);
      } else {
        slotScale.value = 1;
      }
    }
  };

  // watch

  // 监听大小
  watch(
    () => props.size,
    () => {
      nextTick(() => {
        setTextScale();
      });
    }
  );

  // onMounted
  onMounted(() => {
    // 文字缩放
    setTextScale();
  });

  // onUpdated
  onUpdated(() => {
    const slot = slots.default ? slots.default() : null;

    if (slot) {
      // 文字缩放
      setTextScale();
    }
  });

  return {
    // dom
    text,
    wrapper,

    // data
    isSlotShow,
    slotScale,
    slotWidth,

    // methods
    handleImageError,
  };
};
