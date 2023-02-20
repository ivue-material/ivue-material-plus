import { withInstall, withNoopInstall } from '@ivue-material-plus/utils';

import Steps from './src/steps.vue';
import Step from './src/step.vue';

export const IvueSteps = withInstall(Steps, {
  Step,
});
export default IvueSteps;

export const IvueStep = withNoopInstall(Step);

export * from './src/steps';
export * from './src/step';
