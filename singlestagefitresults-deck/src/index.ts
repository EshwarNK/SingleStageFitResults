import { IDeckPlugin } from '@spinnaker/core';
import { deployFetchTestIdDisplayFitResults } from './DeployFetchTestIdDisplayFitResults';
import { initialize } from './DeployFetchTestIdDisplayFitResults';

export const plugin: IDeckPlugin = {
  initialize,
  stages: [deployFetchTestIdDisplayFitResults],
};
