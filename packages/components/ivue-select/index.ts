import { withInstall, withNoopInstall } from '@ivue-material-plus/utils';

import Select from './src/select.vue';
import Option from './src/option.vue';
import OptionGroup from './src/option-group.vue';

export const IvueSelect = withInstall(Select, {
  Option,
  OptionGroup,
});

export default IvueSelect;

export const IvueOption = withNoopInstall(Option);
export const IvueOptionGroup = withNoopInstall(OptionGroup);

export * from './src/select';
export * from './src/option';
export * from './src/option-group';

declare module '@vue/runtime-core' {
  export interface GlobalComponents {
    IvueSelect: typeof import('@ivue-material-plus/components')['IvueSelect'];
    IvueOption: typeof import('@ivue-material-plus/components')['IvueOption'];
    IvueOptionGroup: typeof import('@ivue-material-plus/components')['IvueOptionGroup'];
  }
}
