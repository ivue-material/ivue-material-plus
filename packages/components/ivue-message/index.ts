import { withInstallFunction } from '@ivue-material-plus/utils';
import Message from './src/message-instances';

export const IvueMessage = withInstallFunction(Message, '$IvueMessage');
export default IvueMessage;

export * from './src/message';

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $IvueMessage: typeof import('@ivue-material-plus/components')['IvueMessage'];
  }
}
