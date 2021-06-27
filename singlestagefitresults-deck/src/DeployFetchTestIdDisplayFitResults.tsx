import React from 'react';

import {
  CheckboxInput,
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

import './DeployFetchTestIdDisplayFitResults.less';

export function DeployFetchTestIdDisplayFitResultsStageConfig(props: IStageConfigProps) {
  return (
    <div className="DeployFetchTestIdDisplayFitResultsStageConfig">
      <FormikStageConfig
        {...props}
        onChange={props.updateStage}
        render={(props: IFormikStageConfigInjectedProps) => <DeployFetchTestIdDisplayFitResultsStageForm {...props} />}
      />
    </div>
  );
}

function DeployFetchTestIdDisplayFitResultsStageForm(props: IFormikStageConfigInjectedProps) {
  return (
    <div className="form-horizontal">
      <h3>
        <b>Deploy Stage</b>
      </h3>
      <h4> Basic Settings </h4>
      <FormikFormField
        name="account"
        label="Account"
        required={true}
        input={(inputProps: IFormInputProps) => <ReactSelectInput {...inputProps} />}
      />
      <FormikFormField
        name="OverrideNamespace"
        label="Override Namespace"
        input={(props) => <CheckboxInput text={''} {...props} />}
      />
    </div>
  );
}

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
  component: DeployFetchTestIdDisplayFitResultsStageConfig,
  executionDetailsSections: [ExecutionDetailsTasks],
};

// import { CopyFromTemplateButton } from './CopyFromTemplateButton';
// import { IManifestBindArtifact } from './ManifestBindArtifactsSelector';
// import { ManifestBindArtifactsSelector } from './ManifestBindArtifactsSelector';
// import { ManifestDeploymentOptions } from './ManifestDeploymentOptions';
// import { NamespaceSelector } from './NamespaceSelector';
// import { ManifestSource } from './ManifestSource';
// import { ManifestBasicSettings } from './BasicSettings';

// export const initialize = () => {
//   HelpContentsRegistry.register('DeployFetchTestIdDisplayFitResults', 'Stage that performs deployment, retrieves testID and fetch results');
// };

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

// export function RandomWaitStageConfig(props: IStageConfigProps) {
//   return (
//     <div className="RandomWaitStageConfig">
//       <FormikStageConfig
//         {...props}
//         validate={validate}
//         onChange={props.updateStage}
//         render={(props) => (
//           <FormikFormField
//             name="maxWaitTime"
//             label="Max Time To Wait"
//             help={<HelpField id="armory.randomWaitStage.maxWaitTime" />}
//             input={(props) => <NumberInput {...props} />}
//           />
//         )}
//       />
//     </div>
//   );
// }

// function DeployFetchTestIdDisplayFitResultsStageForm(props: IFormikStageConfigInjectedProps) {
//
//       return (
//           <div className="form-horizontal">
//           <h3><b>Deploy Stage</b></h3>
//              <h4> Basic Settings </h4>
//                 <FormikFormField
//                   name="account"
//                   label="Account"
//                   required={true}
//                   input={(inputProps: IFormInputProps) => (
//                     <ReactSelectInput
//                       {...inputProps}
//                     />
//                   )}
//                 />
//                 <FormikFormField
//                  name="OverrideNamespace"
//                   label="Override Namespace"
//                    input={props =>
//                      <CheckboxInput text={""} {...props} />
//                    }
//                  />
//              </div>
//  );
// }
//
// interface IDeployManifestStageConfigFormProps {
//   accounts?: IAccountDetails[];
// }
//
// interface IDeployManifestStageConfigFormState {
//   rawManifest: string;
//   overrideNamespace: boolean;
// }
//
// export class DeployFetchTestIdDisplayFitResultsStageForm extends React.Component<
//   IDeployManifestStageConfigFormProps & IFormikStageConfigInjectedProps,
//   IDeployManifestStageConfigFormState
// > {
//   private readonly excludedManifestArtifactTypes = [
//     ArtifactTypePatterns.DOCKER_IMAGE,
//     ArtifactTypePatterns.KUBERNETES,
//     ArtifactTypePatterns.FRONT50_PIPELINE_TEMPLATE,
//     ArtifactTypePatterns.MAVEN_FILE,
//   ];
//
//   public constructor(props: IDeployManifestStageConfigFormProps & IFormikStageConfigInjectedProps) {
//     super(props);
//     const stage = this.props.formik.values;
//     const manifests: any[] = get(props.formik.values, 'manifests');
//     const isTextManifest: boolean = get(props.formik.values, 'source') === ManifestSource.TEXT;
//     this.state = {
//       rawManifest: !isEmpty(manifests) && isTextManifest ? yamlDocumentsToString(manifests) : '',
//       overrideNamespace: get(stage, 'namespaceOverride', '') !== '',
//     };
//   }
//
// //   private getSourceOptions = (): Array<Option<string>> => {
// //     return map([ManifestSource.TEXT, ManifestSource.ARTIFACT], (option) => ({
// //       label: capitalize(option),
// //       value: option,
// //     }));
// //   };
//
//   private handleCopy = (manifest: IManifest): void => {
//     this.props.formik.setFieldValue('manifests', [manifest]);
//     this.setState({
//       rawManifest: yamlDocumentsToString([manifest]),
//     });
//   };
//
//   private handleRawManifestChange = (rawManifest: string, manifests: any): void => {
//     this.setState({
//       rawManifest,
//     });
//     this.props.formik.setFieldValue('manifests', manifests);
//   };
//
//   private onManifestArtifactSelected = (expectedArtifactId: string): void => {
//     this.props.formik.setFieldValue('manifestArtifactId', expectedArtifactId);
//     this.props.formik.setFieldValue('manifestArtifact', null);
//   };
//
//   private onManifestArtifactEdited = (artifact: IArtifact) => {
//     this.props.formik.setFieldValue('manifestArtifactId', null);
//     this.props.formik.setFieldValue('manifestArtifact', artifact);
//   };
//
//   private getRequiredArtifacts = (): IManifestBindArtifact[] => {
//     const { requiredArtifactIds, requiredArtifacts } = this.props.formik.values;
//     return (requiredArtifactIds || [])
//       .map((id: string) => ({ expectedArtifactId: id }))
//       .concat(requiredArtifacts || []);
//   };
//
//   private onRequiredArtifactsChanged = (bindings: IManifestBindArtifact[]): void => {
//     this.props.formik.setFieldValue(
//       'requiredArtifactIds',
//       bindings.filter((b) => b.expectedArtifactId).map((b) => b.expectedArtifactId),
//     );
//     this.props.formik.setFieldValue(
//       'requiredArtifacts',
//       bindings.filter((b) => b.artifact),
//     );
//   };
//
//   private overrideNamespaceChange(checked: boolean) {
//     if (!checked) {
//       this.props.formik.setFieldValue('namespaceOverride', '');
//     }
//     this.setState({ overrideNamespace: checked });
//   }
//
//   public render() {
//     const stage = this.props.formik.values;
//     return (
//       <div className="form-horizontal">
//         <h4>Basic Settings</h4>
//         <ManifestBasicSettings
//           accounts={this.props.accounts}
//           onAccountSelect={(accountName) => this.props.formik.setFieldValue('account', accountName)}
//           selectedAccount={stage.account}
//         />
//         <StageConfigField label="Override Namespace">
//           <CheckboxInput
//             checked={this.state.overrideNamespace}
//             onChange={(e: any) => this.overrideNamespaceChange(e.target.checked)}
//           />
//         </StageConfigField>
//         {this.state.overrideNamespace && (
//           <StageConfigField label="Namespace">
//             <NamespaceSelector
//               createable={true}
//               accounts={this.props.accounts}
//               selectedAccount={stage.account}
//               selectedNamespace={stage.namespaceOverride || ''}
//               onChange={(namespace) => this.props.formik.setFieldValue('namespaceOverride', namespace)}
//             />
//           </StageConfigField>
//         )}
//         <hr />
//         <h4>Manifest Configuration</h4>
//         <StageConfigField label="Manifest Source" helpKey="kubernetes.manifest.source">
//           <RadioButtonInput
//             onChange={(e: any) => this.props.formik.setFieldValue('source', e.target.value)}
//             value={stage.source}
//           />
//         </StageConfigField>
//         {stage.source === ManifestSource.TEXT && (
//           <StageConfigField label="Manifest">
//             <CopyFromTemplateButton application={this.props.application} handleCopy={this.handleCopy} />
//             <YamlEditor onChange={this.handleRawManifestChange} value={this.state.rawManifest} />
//           </StageConfigField>
//         )}
//         {stage.source === ManifestSource.ARTIFACT && (
//           <>
//             <StageArtifactSelectorDelegate
//               artifact={stage.manifestArtifact}
//               excludedArtifactTypePatterns={this.excludedManifestArtifactTypes}
//               expectedArtifactId={stage.manifestArtifactId}
//               helpKey="kubernetes.manifest.expectedArtifact"
//               label="Manifest Artifact"
//               onArtifactEdited={this.onManifestArtifactEdited}
//               onExpectedArtifactSelected={(artifact: IExpectedArtifact) => this.onManifestArtifactSelected(artifact.id)}
//               pipeline={this.props.pipeline}
//               stage={stage}
//             />
//             <StageConfigField label="Expression Evaluation" helpKey="kubernetes.manifest.skipExpressionEvaluation">
//               <CheckboxInput
//                 checked={stage.skipExpressionEvaluation === true}
//                 onChange={(e: any) => this.props.formik.setFieldValue('skipExpressionEvaluation', e.target.checked)}
//                 text="Skip SpEL expression evaluation"
//               />
//             </StageConfigField>
//           </>
//         )}
//         <StageConfigField label="Required Artifacts to Bind" helpKey="kubernetes.manifest.requiredArtifactsToBind">
//           <ManifestBindArtifactsSelector
//             bindings={this.getRequiredArtifacts()}
//             onChangeBindings={this.onRequiredArtifactsChanged}
//             pipeline={this.props.pipeline}
//             stage={stage}
//           />
//         </StageConfigField>
//         <hr />
//         <ManifestDeploymentOptions
//           accounts={this.props.accounts}
//           config={stage.trafficManagement}
//           onConfigChange={(config) => this.props.formik.setFieldValue('trafficManagement', config)}
//           selectedAccount={stage.account}
//         />
//       </div>
//     );
//   }
// }

// export function RandomWaitStageExecutionDetails(props: IExecutionDetailsSectionProps) {
//   return (
//     <ExecutionDetailsSection name={props.name} current={props.current}>
//       <div>
//         <p>Waited {props.stage.outputs.timeToWait} second(s)</p>
//       </div>
//     </ExecutionDetailsSection>
//   );
// }

// export function validate(stageConfig: IStage) {
//   const validator = new FormValidator(stageConfig);
//
//   validator
//     .field('maxWaitTime')
//     .required()
//     .withValidators((value, label) => (value < 0 ? `${label} must be non-negative` : undefined));
//
//   return validator.validateForm();
// }

// export namespace RandomWaitStageExecutionDetails {
//   export const title = 'randomWait';
// }

/*
Define Spinnaker Stages with IStageTypeConfig.
Required options: https://github.com/spinnaker/deck/master/app/scripts/modules/core/src/domain/IStageTypeConfig.ts
- label -> The name of the Stage
- description -> Long form that describes what the Stage actually does
- key -> ties to Orca backend
- component -> The rendered React component
- validateFn -> A validation function for the stage config form.
*/

// export const deployFetchTestIdDisplayFitResults: IStageTypeConfig = {
//   key: `DeployFetchTestIdDisplayFitResults`,
//   label: 'Deploy(DeployGetTestIDFetchResults)',
//   description: 'Stage that performs deployment, retrieves testID and fetch results',
//   component: DeployFetchTestIdDisplayFitResultsStageConfig,
//   executionDetailsSections: [ExecutionDetailsTasks],
// };
