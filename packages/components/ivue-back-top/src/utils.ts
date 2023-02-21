/**
 * 滚动到顶部
 * @param el 元素
 * @param from 开始的位置
 * @param to 结束的位置
 * @param duration 滚动动画持续时间，单位 毫秒
 * @param endCallback 结束后的回调
 */
export function scrollTop(
  el: HTMLElement | Window,
  from = 0,
  to: number,
  duration = 500,
  endCallback?: () => void
) {
  // requestAnimationFrame 兼容
  if (!window.requestAnimationFrame) {
    window.requestAnimationFrame =
      (window as any).webkitRequestAnimationFrame ||
      (window as any).mozRequestAnimationFrame ||
      (window as any).msRequestAnimationFrame ||
      function (callback) {
        return window.setTimeout(callback, 1000 / 60);
      };
  }

  // 差值
  const difference = Math.abs(from - to);

  // 每一步的位置
  const step = Math.ceil((difference / duration) * 50);

  // 滚动
  function scroll(start: number, end: number, step: number) {
    // 滚动结束
    if (start === end) {
      endCallback && endCallback();

      return;
    }

    let d = start + step > end ? end : start + step;

    // 开始位置大于结束
    if (start > end) {
      d = start - step < end ? end : start - step;
    }

    // window 节点使用 scrollTo
    if (el === window) {
      window.scrollTo(d, d);
    }
    // 元素节点使用 scrollTop
    else {
      (el as HTMLElement).scrollTop = d;
    }

    // requestAnimationFrame
    window.requestAnimationFrame(() => scroll(d, end, step));
  }

  // 滚动
  scroll(from, to, step);
}
