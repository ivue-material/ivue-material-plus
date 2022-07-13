import { createVNode, render } from 'vue';
import LoadingBar from './index.vue';

type options = {
  percent?: number,
  status?: string,
  color?: string,
  failedColor?: string,
  height?: number,
  visible?: boolean
}

// 实例列表
let instances;
let color = 'primary';
let failedColor = 'error';
let height = 2;
let timer;

const newInstance = (options: options) => {

  // 实例对象
  const vm = instances || createVNode(LoadingBar, options);

  const container = document.createElement('div');

  // 清除通知元素防止内存泄漏
  vm.props.onDestroy = () => {
    // 既然元素被销毁了，那么VNode也应该被GC回收
    // 我们不想造成任何内存泄漏，因为我们已经返回 vm 作为对用户的引用
    // 以便我们手动将其设置为 false。
    render(null, container);
  };

  render(vm, container);

  // 当 close 函数被调用时，实例将删除此项。 所以我们不需要担心。
  instances = vm;

  document.body.appendChild(container.firstElementChild);

  return {
    update(options: options) {
      const data = vm.component.proxy.data;

      if (options.percent) {
        data.percent = options.percent;
      }

      data.visible = options.visible;

      if (options.status) {
        data.status = options.status;
      }
    },
    component: vm,
    // 销毁
    destroy() {
      document.body.removeChild(document.getElementsByClassName('ivue-loading-bar')[0]);
    }
  };

};


// 获取组件实例
const getIvueLoadingBarInstance = () => {
  instances = instances || newInstance({
    color: color,
    failedColor: failedColor,
    height: height
  });

  return instances;
};

// 更新组件
const update = (options: options) => {
  const instance = getIvueLoadingBarInstance();

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
      visible: false
    });

    setTimeout(() => {
      update({
        percent: 0
      });
    }, 200);
  }, 800);
};


export default {
  // 开始
  start() {
    let percent = 0;

    update({
      percent: percent,
      status: 'success',
      visible: true
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
        visible: true
      });
    }, 200);

  },
  // 更新
  update(percent) {
    clearTimer();

    update({
      percent: percent,
      status: 'success',
      visible: true
    });
  },
  // 完成
  finish() {
    clearTimer();

    update({
      percent: 100,
      status: 'success',
      visible: true
    });


    hide();
  },
  // 错误
  error() {
    clearTimer();
    update({
      percent: 100,
      status: 'error',
      visible: true
    });
    hide();
  },
  // 公共参数
  config(options: options) {
    if (options.color) {
      color = options.color;
    }

    if (options.failedColor) {
      failedColor = options.failedColor;
    }

    if (options.height) {
      height = options.height;
    }
  },
  // 销毁
  destroy() {
    clearTimer();
    const _instance = getIvueLoadingBarInstance();

    instances = null;

    _instance.destroy();
  }
};
