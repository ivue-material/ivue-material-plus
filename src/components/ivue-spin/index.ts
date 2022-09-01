import { withInstallFunction } from '../../utils/install';
import Spin from './init';

export const IvueSpin = withInstallFunction(Spin, '$IvueSpin');
export default IvueSpin;

export * from './index.vue';
