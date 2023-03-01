import { withInstall } from '@ivue-material-plus/utils';
import DatePicker from './src/date-picker.vue';

export const IvueDatePicker = withInstall(DatePicker);
export default IvueDatePicker;

export * from './src/date-picker';

declare module '@vue/runtime-core' {
  export interface GlobalComponents {
    IvueDatePicker: typeof import('@ivue-material-plus/components')['IvueDatePicker'];
  }
}
