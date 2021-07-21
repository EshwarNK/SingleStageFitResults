import React from 'react';

import {
  CheckboxInput,
  ExecutionArtifactTab,
  ExecutionDetailsSection,
  ExecutionDetailsTasks,
  FormikFormField,
  FormikStageConfig,
  FormValidator,
  HelpContentsRegistry,
  HelpField,
  IExecutionDetailsSectionProps,
  IFormikStageConfigInjectedProps,
  IFormInputProps,
  IStage,
  IStageConfigProps,
  IStageTypeConfig,
  NumberInput,
  ReactSelectInput,
  TextInput,
  Validators,
} from '@spinnaker/core';

import { DeployFetchTestIdDisplayFitResultsStageConfig } from './DeployFetchTestIdDisplayFitResultsStageConfig';
import { DeployStatus } from './manifestStatus/DeployStatus';

import './DeployFetchTestIdDisplayFitResults.less';

export const initialize = () => {
  HelpContentsRegistry.register('salesforce.fitResultsSpringLoaderPlugin', 'Spinnaker Plugin');
};

// export function DeployFetchTestIdDisplayFitResultsStageConfig(props: IStageConfigProps) {
//   return (
//     <div className="DeployFetchTestIdDisplayFitResultsStageConfig">
//       <FormikStageConfig
//         {...props}
//         onChange={props.updateStage}
//         render={(props: IFormikStageConfigInjectedProps) => <DeployFetchTestIdDisplayFitResultsStageForm {...props} />}
//       />
//     </div>
//   );
// }

// function DeployFetchTestIdDisplayFitResultsStageForm(props: IFormikStageConfigInjectedProps) {
//   return (
//     <div className="form-horizontal">
//       <h3>
//         <b>Deploy Stage</b>
//       </h3>
//       <h4> Basic Settings </h4>
//       <FormikFormField
//         name="account"
//         label="Account"
//         required={true}
//         input={(inputProps: IFormInputProps) => <ReactSelectInput {...inputProps} />}
//       />
//       <FormikFormField
//         name="OverrideNamespace"
//         label="Override Namespace"
//         input={(props) => <CheckboxInput text={''} {...props} />}
//       />
//     </div>
//   );
// }

export const deployFetchTestIdDisplayFitResults: IStageTypeConfig = {
  //Note: the key here should match with the name mentioned in the @StageDefinitionBuilder.Aliases({}) in DeployFetchTestIdDisplayFitResults.java
  key: 'DeployFetchTestIdDisplayFitResults',
  label: `Deploy(DeployGetTestIDFetchResults)`,
  description: 'Stage that performs deployment, retrieves testID and fetch results',
  component: DeployFetchTestIdDisplayFitResultsStageConfig,
  executionDetailsSections: [DeployStatus, ExecutionDetailsTasks, ExecutionArtifactTab],
};
