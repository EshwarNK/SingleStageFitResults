import React from 'react';

import {
  ExecutionDetailsSection,
  ExecutionDetailsTasks,
  FormikFormField,
  FormikStageConfig,
  FormValidator,
  HelpContentsRegistry,
  HelpField,
  IExecutionDetailsSectionProps,
  IFormikStageConfigInjectedProps,
  IStage,
  IStageConfigProps,
  IStageTypeConfig,
  NumberInput,
  TextInput,
  Validators,
} from '@spinnaker/core';

import './DeployFetchTestIdDisplayFitResults.less';

/*
Define Spinnaker Stages with IStageTypeConfig.
Required options: https://github.com/spinnaker/deck/master/app/scripts/modules/core/src/domain/IStageTypeConfig.ts
- label -> The name of the Stage
- description -> Long form that describes what the Stage actually does
- key -> A unique name for the Stage in the UI; ties to Orca backend
- component -> The rendered React component
- validateFn -> A validation function for the stage config form.
*/

export const deployFetchTestIdDisplayFitResults: IStageTypeConfig = {
  key: 'Deploy(DeployGetTestIDFetchResults)',
  label: `Deploy GetTestID FetchResults`,
  description: 'Stage that performs deployment, retrieves testID and fetch results',
  executionDetailsSections: [ExecutionDetailsTasks],
};
