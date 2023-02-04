import sleep from './sleep';

// 模拟滚动
const makeScroll = (
  dom: Element,
  name: 'scrollTop' | 'scrollLeft',
  offset: number
) => {
  const eventTarget = dom === document.documentElement ? window : dom;
  dom[name] = offset;

  // 自定义事件
  const evt = new CustomEvent('scroll', {
    detail: {
      target: {
        [name]: offset,
      },
    },
  });

  // 触发自定义事件的方法
  eventTarget.dispatchEvent(evt);

  // 必须使用 setTimeout 而不是 nextTick 来等待 dom 变化
  return sleep();
};

export default makeScroll;
