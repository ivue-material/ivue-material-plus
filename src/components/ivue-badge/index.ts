import { App } from 'vue';
import IvueBadge from './index.vue';

export default (app: App): void => {
    app.component(IvueBadge.name, IvueBadge);
};

export { IvueBadge };
