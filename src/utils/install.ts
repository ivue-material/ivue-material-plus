
import { NOOP } from '@vue/shared';

import type { AppContext, Plugin, App } from 'vue';

export type SFCWithInstall<T> = T & Plugin

export type SFCInstallWithContext<T> = SFCWithInstall<T> & {
  _context: AppContext | null
}


// 安装组件
export const withInstall = <T, E extends Record<string, any>>(
  // 当前组件
  main: T,
  // 关联的组件
  extra?: E
) => {

  // 安装组件 组件.install
  (main as SFCWithInstall<T>).install = (app): void => {
    for (const comp of [main, ...Object.values(extra ?? {})]) {
      app.component(comp.name, comp);
    }
  };

  // 关联的组件
  if (extra) {
    for (const [key, comp] of Object.entries(extra)) {
      (main as any)[key] = comp;
    }
  }

  return main as SFCWithInstall<T> & E;
};

// 使用noop安装
export const withNoopInstall = <T>(component: T) => {
  (component as SFCWithInstall<T>).install = NOOP;

  return component as SFCWithInstall<T>;
};


// 注册指令
export const withInstallDirective = <T>(directive: T, name: string) => {
  (directive as SFCWithInstall<T>).install = (app: App): any => {
    app.directive(name, directive);
  };

  return directive as SFCWithInstall<T>;
};

// 注册全局方法
export const withInstallFunction = <T>(fn: T, name: string) => {
  (fn as SFCWithInstall<T>).install = (app: App) => {
    // 当前vue实例
    (fn as SFCInstallWithContext<T>)._context = app._context;

    // 注册全局方法
    app.config.globalProperties[name] = fn;
  };

  return fn as SFCInstallWithContext<T>;
};
