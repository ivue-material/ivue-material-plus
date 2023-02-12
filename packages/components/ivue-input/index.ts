import { withInstall } from '@ivue-material-plus/utils';

import Input from './src/input.vue';

export const IvueInput = withInstall(Input);
export default IvueInput;

export * from './src/input';

declare module '@vue/runtime-core' {
  export interface GlobalComponents {
    IvueInput: typeof import('@ivue-material-plus/components')['IvueInput'];
  }
}
