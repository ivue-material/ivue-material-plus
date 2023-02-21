import {
  createApp,
  h,
  getCurrentInstance,
  VNode,
  ComponentInternalInstance,
} from 'vue';
import {
  transferIndex,
  transferIncrease,
} from '@ivue-material-plus/utils/transfer-queue';
import Spin from './spin.vue';

// type
import { SpinInstance } from './spin';

// 获取Index
const handleGetIndex = () => {
  transferIncrease();
  return transferIndex;
};

// 当前index
let tIndex = handleGetIndex();

// 新实例
Spin.newInstance = (props = {}) => {
  let _instance: ComponentInternalInstance;

  const Instance = createApp({
    // data
    data() {
      return Object.assign({}, props);
    },
    // created
    created() {
      _instance = getCurrentInstance() as ComponentInternalInstance;
    },
    // render
    render() {
      let vnode: VNode | null = null;

      // 有渲染函数
      if (this.render) {
        vnode = h(
          Spin,
          {
            fix: true,
            fullscreen: true,
            ref: 'spin',
          },
          {
            default: () => this.render(h),
          }
        );
      }
      // 没有渲染函数
      else {
        vnode = h(Spin, {
          size: 'large',
          fix: true,
          fullscreen: true,
          ref: 'spin',
        });
      }

      return h(
        'div',
        {
          class: 'ivue-spin-fullscreen',
          style: {
            'z-index': 2010 + tIndex,
          },
        },
        [vnode]
      );
    },
  });

  // 渲染
  const container = document.createElement('div');
  document.body.appendChild(container);
  Instance.mount(container);

  const spin = _instance!.refs.spin as SpinInstance;

  return {
    // 显示
    show() {
      spin.visible = true;

      tIndex = handleGetIndex();
    },
    // 删除
    remove(callback = () => {}) {
      spin.visible = false;

      setTimeout(() => {
        Instance.unmount();
        document.body.removeChild(container);

        callback();
      }, 300);
    },
    component: spin,
  };
};

export default Spin;
