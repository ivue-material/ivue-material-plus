import { App } from 'vue';

import IvueSteps from './steps.vue';
import IvueStep from './step.vue';

export default (app: App): void => {
    app.component(IvueSteps.name, IvueSteps);
    app.component(IvueStep.name, IvueStep);

};

export { IvueSteps, IvueStep };
