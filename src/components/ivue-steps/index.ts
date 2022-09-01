import { withInstall, withNoopInstall } from '../../utils/install';

import Steps from './steps.vue';
import Step from './step.vue';

export const IvueSteps = withInstall(Steps, {
    Step,
});
export default IvueSteps;

export const IvueStep = withNoopInstall(Step);

export * from './steps.vue';
export * from './step.vue';
