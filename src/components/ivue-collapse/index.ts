import { withInstall, withNoopInstall } from '../../utils/install';
import Collapse from './collapse.vue';
import CollapsePanel from './panel.vue';

export const IvueCollapse = withInstall(Collapse, {
  CollapsePanel,
});
export default IvueCollapse;

export const IvueCollapsePanel = withNoopInstall(CollapsePanel);

export * from './collapse.vue';
export * from './panel.vue';
