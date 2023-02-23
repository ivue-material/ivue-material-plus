import { IvueLoading } from '@ivue-material-plus/components/ivue-loading';
import { RippleDirective } from '@ivue-material-plus/components/ivue-ripple';
import { IvueNotice } from '@ivue-material-plus/components/ivue-notice';

import type { Plugin } from 'vue';

export default [IvueLoading, RippleDirective, IvueNotice] as Plugin[];
