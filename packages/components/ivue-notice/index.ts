import { withInstallFunction } from '@ivue-material-plus/utils';
import './index.less';

import Notice from './src/notice-increase';

export const IvueNotice = withInstallFunction(Notice, '$IvueNotice');
export default IvueNotice;

export * from './src/notice';

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $IvueNotice: typeof import('@ivue-material-plus/components')['IvueNotice'];
  }
}
