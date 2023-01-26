import { withInstall } from '../../utils/install';

import Tree from './index.vue';

// Tree.install = (app: App): void => {
//   app.component(Tree.name, Tree);
// };

export const IvueTree = withInstall(Tree);
export default IvueTree;

export * from './index.vue';
