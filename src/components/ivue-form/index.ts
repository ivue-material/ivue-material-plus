import { withInstall, withNoopInstall } from '../../utils/install';

import Form from './form.vue';
import FormItem from './form-item.vue';

export const IvueForm = withInstall(Form, {
  FormItem,
});

export const IvueFormItem = withNoopInstall(FormItem);

export default IvueForm;

export * from './form.vue';
export * from './form-item.vue';
