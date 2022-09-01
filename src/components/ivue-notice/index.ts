import { withInstallFunction } from '../../utils/install';
import Notice from './notice';

export const IvueNotice = withInstallFunction(Notice, '$notice');
export default IvueNotice;

export * from './index.vue';
