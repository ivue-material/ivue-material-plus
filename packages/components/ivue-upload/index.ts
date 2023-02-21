import { withInstall } from '@ivue-material-plus/utils';

import Upload from './src/upload.vue';

export const IvueUpload = withInstall(Upload);
export default IvueUpload;

export * from './src/upload';

declare module '@vue/runtime-core' {
  export interface GlobalComponents {
    IvueUpload: typeof import('@ivue-material-plus/components')['IvueUpload'];
  }
}
