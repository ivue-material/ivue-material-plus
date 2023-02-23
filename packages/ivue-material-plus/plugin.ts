import { IvueLoading } from '@ivue-material-plus/components/ivue-loading';
import { RippleDirective } from '@ivue-material-plus/components/ivue-ripple';
import { IvueNotice } from '@ivue-material-plus/components/ivue-notice';
import { IvueMessage } from '@ivue-material-plus/components/ivue-message';

import type { Plugin } from 'vue';

export default [
  IvueLoading,
  IvueNotice,
  IvueMessage,
  RippleDirective,
] as Plugin[];
