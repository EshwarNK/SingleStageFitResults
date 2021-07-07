import { IDeckPlugin } from '@spinnaker/core';
import { deployFetchTestIdDisplayFitResults } from './DeployFetchTestIdDisplayFitResults';
// import { initialize } from './DeployFetchTestIdDisplayFitResultsStageConfig';

export const plugin: IDeckPlugin = {
  // initialize,
  stages: [deployFetchTestIdDisplayFitResults],
};
