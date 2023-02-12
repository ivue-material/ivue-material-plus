import { withInstall } from '@ivue-material-plus/utils';

import Button from './src/button.vue';

export const IvueButton = withInstall(Button);
export default IvueButton;

export * from './src/button';

declare module '@vue/runtime-core' {
  export interface GlobalComponents {
    IvueButton: typeof import('@ivue-material-plus/components')['IvueButton'];
  }
}
