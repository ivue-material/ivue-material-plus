import { onMounted, ref, watch } from 'vue';
import type { Ref } from 'vue';

// 节流渲染
export const useThrottleRender = (loading: Ref<boolean>, throttle = 0) => {
  // 节流
  if (throttle === 0) {
    return loading;
  }

  // data

  // 节流
  const throttled = ref(false);

  // 倒计时
  let setTimeout = 0;

  // methods

  // 节流事件
  const throttlingHandle = () => {
    if (setTimeout) {
      clearTimeout(setTimeout);
    }

    // 倒计时
    setTimeout = window.setTimeout(() => {
      throttled.value = loading.value;
    }, throttle);
  };

  // watch

  // 监听加载完成
  watch(
    () => loading.value,
    (value) => {
      if (value) {
        throttlingHandle();
      } else {
        throttled.value = value;
      }
    }
  );

  // onMounted
  onMounted(throttlingHandle);

  return throttled;
};
