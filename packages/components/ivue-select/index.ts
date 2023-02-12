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
