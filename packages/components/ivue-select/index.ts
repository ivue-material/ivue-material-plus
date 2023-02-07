import { withInstall, withNoopInstall } from '../../utils/install';

import Select from './index.vue';
import Option from './option.vue';
import OptionGroup from './option-group.vue';

export const IvueSelect = withInstall(Select, {
  Option,
  OptionGroup,
});

export default IvueSelect;

export const IvueOption = withNoopInstall(Option);
export const IvueOptionGroup = withNoopInstall(OptionGroup);

export * from './index.vue';
export * from './option.vue';
export * from './option-group.vue';
