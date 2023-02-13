// 组件
export * from '@ivue-material-plus/components';
// hooks
export * from '@ivue-material-plus/hooks';
// directives
export * from '@ivue-material-plus/directives';

// 安装组件
import installer from './defaults';

// makeInstaller
export * from './make-installer';

export const install = installer.install;
export const version = installer.version;

export default installer;
