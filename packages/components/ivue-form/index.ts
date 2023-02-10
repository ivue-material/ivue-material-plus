import { withInstall, withNoopInstall } from '@ivue-material-plus/utils';

import Form from './src/form.vue';
import FormItem from './src/form-item.vue';

export const IvueForm = withInstall(Form, {
  FormItem,
});

export const IvueFormItem = withNoopInstall(FormItem);

export default IvueForm;

export * from './src/form';
export * from './src/form-item';
