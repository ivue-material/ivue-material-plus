import { withInstall, withNoopInstall } from '@ivue-material-plus/utils';

import Tabs from './src/tabs.vue';
import Tab from './src/tab.vue';
import TabItem from './src/item.vue';

export const IvueTabs = withInstall(Tabs, {
  Tab,
  TabItem,
});
export default IvueTabs;

export const IvueTab = withNoopInstall(Tab);
export const IvueTabItem = withNoopInstall(TabItem);

export * from './src/tabs';
export * from './src/tab';
export * from './src/item';

declare module '@vue/runtime-core' {
  export interface GlobalComponents {
    IvueTabs: typeof import('@ivue-material-plus/components')['IvueTabs'];
    IvueTab: typeof import('@ivue-material-plus/components')['IvueTab'];
    IvueTabItem: typeof import('@ivue-material-plus/components')['IvueTabItem'];
  }
}
