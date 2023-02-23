import { createVNode, render } from 'vue';
import LoadingBar from './loading-bar.vue';

// type
import { LoadingBarInstance } from './loading-bar';
import type { VNode } from 'vue';

type Options = {
  percent?: number;
  status?: string;
  color?: string;
  failedColor?: string;
  height?: number;
  visible?: boolean;
  duration?: number;
};

// 实例列表
let instances: VNode | null;

// 进度条的颜色
let color = 'primary';
// 失败时的进度条颜色
let failedColor = 'error';
// 进度条高度
let height = 2;
// 隐藏时的持续时间
let duration = 800;
let timer: ReturnType<typeof setInterval> | null;

const newInstance = (options: Options) => {
  // 实例对象
  const vm = instances || createVNode(LoadingBar, options);

  const container = document.createElement('div');

  // 清除通知元素防止内存泄漏
  vm.props!.onDestroy = () => {
    // 既然元素被销毁了，那么VNode也应该被GC回收
    // 我们不想造成任何内存泄漏，因为我们已经返回 vm 作为对用户的引用
    // 以便我们手动将其设置为 false。
    render(null, container);
  };

  render(vm, container);

  // 当 close 函数被调用时，实例将删除此项。 所以我们不需要担心。
  instances = vm;

  document.body.appendChild(container.firstElementChild as HTMLElement);

  return {
    update(options: Options) {
      const proxy = vm.component!.proxy as LoadingBarInstance;

      if (options.percent !== undefined) {
        proxy.percent = options.percent;
      }

      proxy.visible = options.visible as boolean;

      if (options.status) {
        proxy.status = options.status;
      }
    },
    component: vm,
    // 销毁
    destroy() {
      document.body.removeChild(
        document.getElementsByClassName('ivue-loading-bar')[0]
      );
    },
  };
};

// 获取组件实例
const getIvueLoadingBarInstance = () => {
  instances =
    (instances as VNode) ||
    newInstance({
      color: color,
      failedColor: failedColor,
      height: height,
    });

  return instances;
};

// 更新组件
const update = (options: Options) => {
  const instance = getIvueLoadingBarInstance() as any;

  instance.update(options);
};

// 清除定时器
const clearTimer = () => {
  if (timer) {
    clearInterval(timer);
    timer = null;
  }
};

// 隐藏组件
const hide = () => {
  setTimeout(() => {
    update({
      visible: false,
    });

    setTimeout(() => {
      update({
        percent: 0,
      });
    }, 500);
  }, duration);
};

export default {
  // 开始
  start() {
    // 如果已经开始了不执行
    if (timer) {
      return;
    }

    let percent = 0;

    update({
      percent: percent,
      status: 'success',
      visible: true,
    });

    // 设置进度
    timer = setInterval(() => {
      percent += Math.floor(Math.random() * 3 + 1);

      // 进度大于95清除定时器
      if (percent > 95) {
        clearTimer();
      }

      update({
        percent: percent,
        status: 'success',
        visible: true,
      });
    }, 200);
  },
  // 更新
  update(percent: number) {
    clearTimer();

    update({
      percent: percent,
      status: 'success',
      visible: true,
    });
  },
  // 完成
  finish() {
    clearTimer();

    update({
      percent: 100,
      status: 'success',
      visible: true,
    });

    // 隐藏组件
    hide();
  },
  // 错误
  error() {
    clearTimer();

    update({
      percent: 100,
      status: 'error',
      visible: true,
    });

    // 隐藏组件
    hide();
  },
  // 公共参数
  config(options: Options) {
    if (options.color) {
      color = options.color;
    }

    if (options.failedColor) {
      failedColor = options.failedColor;
    }

    if (options.height) {
      height = options.height;
    }

    if (options.duration) {
      duration = options.duration;
    }
  },
  // 销毁
  destroy() {
    clearTimer();
    const _instance = getIvueLoadingBarInstance() as any;

    instances = null;

    _instance.destroy();
  },
};
