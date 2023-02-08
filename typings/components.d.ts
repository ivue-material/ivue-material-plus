// For this project development
import '@vue/runtime-core';

declare module '@vue/runtime-core' {
  // GlobalComponents for Volar
  // 注册组件
  export interface GlobalComponents {
    IvueAffix: typeof import('../src/index')['IvueAffix'];
    IvueInput: typeof import('../src/index')['IvueInput'];
    IvueIcon: typeof import('../src/index')['IvueIcon'];
    IvueSvgLoader: typeof import('../src/index')['IvueSvgLoader'];
  }

  // interface ComponentCustomProperties {
  //   $IvueImagePreview: typeof import('../src/index')['IvueImagePreview']
  //   $message: typeof import('../src/index')['IvueMessage']
  //   $IvueModal: typeof import('../src/index')['IvueModal']
  //   $notice: typeof import('../src/index')['IvueNotice']
  //   $IvueSpin: typeof import('../src/index')['IvueSpin']
  // }
}

export {};
