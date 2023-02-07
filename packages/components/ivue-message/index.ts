import { withInstallFunction } from '../../utils/install';
import Message from './message';

export const IvueMessage = withInstallFunction(Message, '$message');
export default IvueMessage;

export * from './index.vue';
