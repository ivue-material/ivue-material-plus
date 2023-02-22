import { withInstall } from '@ivue-material-plus/utils';

import Progress from './src/progress.vue';

export const IvueProgress = withInstall(Progress);
export default IvueProgress;

export * from './src/progress';

declare module '@vue/runtime-core' {
  export interface GlobalComponents {
    IvueProgress: typeof import('@ivue-material-plus/components')['IvueProgress'];
  }
}
