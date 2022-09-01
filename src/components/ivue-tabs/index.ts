import { withInstall, withNoopInstall } from '../../utils/install';

import Tabs from './index.vue';
import Tab from './tab.vue';
import TabItem from './item.vue';

export const IvueTabs = withInstall(Tabs, {
    Tab,
    TabItem,
});
export default IvueTabs;

export const IvueTab = withNoopInstall(Tab);
export const IvueTabItem = withNoopInstall(TabItem);

export * from './index.vue';
export * from './tab.vue';
export * from './item.vue';
