import { IDeckPlugin } from '@spinnaker/core';
import { deployFetchTestIdDisplayFitResults } from './DeployFetchTestIdDisplayFitResults';

export const plugin: IDeckPlugin = {
  stages: [deployFetchTestIdDisplayFitResults],
};
