export * from '@ivue-material-plus/components';

import installer from './defaults';
export * from './make-installer';

export const install = installer.install;
export const version = installer.version;

export default installer;
