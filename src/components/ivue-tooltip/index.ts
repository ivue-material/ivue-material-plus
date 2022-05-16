import { App } from 'vue';
import IvueTooltip from './index.vue';

export default (app: App): void => {
    app.component(IvueTooltip.name, IvueTooltip);
};

export { IvueTooltip };
