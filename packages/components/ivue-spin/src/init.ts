// 组件实例
import IvueSpin from './spin-instance';

// type
import type { VNode, ComponentInternalInstance } from 'vue';

type Render = () => VNode | null;

type Options = {
  render?: Render;
};

type SpinInstance = ComponentInternalInstance & {
  show: () => void;
  remove: (callback: any) => void;
};

let spinInstance: SpinInstance | null;

// 获取组件实例
function getSpinInstance(render?: Render): SpinInstance {
  spinInstance =
    spinInstance ||
    IvueSpin.newInstance({
      render: render,
    });

  return spinInstance as SpinInstance;
}

// loading 加载中
function loading(options: Options) {
  const render = 'render' in options ? options.render : undefined;
  const instance = getSpinInstance(render);

  instance.show();
}

// 显示
IvueSpin.show = (props: Options = {}) => {
  return loading(props);
};

// 隐藏
IvueSpin.hide = () => {
  // 没有实例
  if (!spinInstance) {
    return false;
  }

  const instance = getSpinInstance();

  // 删除实例
  instance.remove(() => {
    spinInstance = null;
  });
};

export default IvueSpin;
