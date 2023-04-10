import { withInstall } from '@ivue-material-plus/utils';

import CollapsePanel from '../ivue-collapse/src/panel.vue';

export const IvueCollapsePanel = withInstall(CollapsePanel);
export default IvueCollapsePanel;

export * from '../ivue-collapse/src/panel';

declare module '@vue/runtime-core' {
  export interface GlobalComponents {
    IvueCollapsePanel: typeof import('@ivue-material-plus/components')['IvueCollapsePanel'];
  }
}
