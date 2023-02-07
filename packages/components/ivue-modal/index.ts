import { withInstallFunction } from '../../utils/install';
import Modal from './modal';

export const IvueModal = withInstallFunction(Modal, '$IvueModal');
export default Modal;

export * from './index.vue';
