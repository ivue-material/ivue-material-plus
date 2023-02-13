export const INSTALLED_KEY = 'INSTALLED_KEY';
import { version } from './version';

import type { App, Plugin } from '@vue/runtime-core';

export const makeInstaller = (components: Plugin[] = []) => {
  const install = (app: App, opts: any = {}) => {
    if (app[INSTALLED_KEY]) {
      return;
    }

    app[INSTALLED_KEY] = true;

    // 全局配置
    app.config.globalProperties.$IVUE = {
      // 是否开启 capture 模式
      capture: 'capture' in opts ? opts.capture : true,
      // 是否将弹层放置于 body 内
      transfer: 'transfer' in opts ? opts.transfer : '',
      // 图片预览操作栏选项，按数组顺序排序
      image: {
        toolbar: opts.image
          ? opts.image.toolbar
            ? opts.image.toolbar
            : ''
          : '',
      },
      // 弹窗
      modal: {
        maskClosable: opts.modal
          ? 'maskClosable' in opts.modal
            ? opts.modal.maskClosable
            : false
          : true,
      },
      // 加载中
      spin: {
        fix: opts.spin ? ('fix' in opts.spin ? opts.spin.fix : false) : false,
      },
    };

    components.forEach((c) => app.use(c));
  };

  return {
    version,
    install,
  };
};
