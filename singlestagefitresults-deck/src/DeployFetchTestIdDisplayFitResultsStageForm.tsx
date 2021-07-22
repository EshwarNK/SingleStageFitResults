import { capitalize, get, isBoolean, isEmpty, isString, map } from 'lodash';
import React from 'react';
import Select, { Option } from 'react-select';

import {
  AccountService,
  ArtifactTypePatterns,
  CheckboxInput,
  ExecutionArtifactTab,
  ExecutionDetailsSection,
  ExecutionDetailsTasks,
  FormikFormField,
  FormikStageConfig,
  FormValidator,
  HelpContentsRegistry,
  HelpField,
  IAccount,
  IAccountDetails,
  IArtifact,
  IExecutionDetailsSectionProps,
  IExpectedArtifact,
  IFormikStageConfigInjectedProps,
  IFormInputProps,
  IManifest,
  IStage,
  IStageConfigProps,
  IStageTypeConfig,
  NumberInput,
  RadioButtonInput,
  ReactSelectInput,
  StageArtifactSelector,
  StageArtifactSelectorDelegate,
  StageConfigField,
  TextInput,
  Validators,
  yamlDocumentsToString,
  YamlEditor,
} from '@spinnaker/core';

import { ManifestBasicSettings } from './BasicSettings';
import { CopyFromTemplateButton } from './CopyFromTemplateButton';
import { ManifestBindArtifactsSelector } from './ManifestBindArtifactsSelector';
import { IManifestBindArtifact } from './ManifestBindArtifactsSelector';
import { ManifestDeploymentOptions } from './ManifestDeploymentOptions';
import { ManifestSource } from './ManifestSource';
import { NamespaceSelector } from './NamespaceSelector';

import './DeployFetchTestIdDisplayFitResults.less';

interface IDeployManifestStageConfigFormProps {
  accounts: IAccountDetails[];
}

interface IDeployManifestStageConfigFormState {
  rawManifest: string;
  overrideNamespace: boolean;
}

export interface IKubernetesRunJobStageConfigState {
  credentials: IAccount[];
  rawManifest?: string;
}

export class DeployFetchTestIdDisplayFitResultsStageForm extends React.Component<
  IDeployManifestStageConfigFormProps & IFormikStageConfigInjectedProps & Partial<IStageConfigProps>,
  IDeployManifestStageConfigFormState
> {
  public runstate: IKubernetesRunJobStageConfigState = {
    credentials: [],
  };

  private readonly excludedManifestArtifactTypes = [
    ArtifactTypePatterns.DOCKER_IMAGE,
    ArtifactTypePatterns.KUBERNETES,
    ArtifactTypePatterns.FRONT50_PIPELINE_TEMPLATE,
    ArtifactTypePatterns.MAVEN_FILE,
  ];

  public constructor(props: IDeployManifestStageConfigFormProps & IFormikStageConfigInjectedProps & IStageConfigProps) {
    super(props);
    const stage = this.props.formik.values;
    const manifests: any[] = get(props.formik.values, 'manifests');
    const isTextManifest: boolean = get(props.formik.values, 'source') === ManifestSource.TEXT;
    this.state = {
      rawManifest: !isEmpty(manifests) && isTextManifest ? yamlDocumentsToString(manifests) : '',
      overrideNamespace: get(stage, 'namespaceOverride', '') !== '',
    };
    const application = this.props;
    const runstage = this.props;
  }

  private getSourceOptions = (): Array<Option<string>> => {
    return map([ManifestSource.TEXT, ManifestSource.ARTIFACT], (option: any) => ({
      label: capitalize(option),
      value: option,
    }));
  };

  private handleCopy = (manifest: IManifest): void => {
    this.props.formik.setFieldValue('manifests', [manifest]);
    this.setState({
      rawManifest: yamlDocumentsToString([manifest]),
    });
  };

  private handleRawManifestChange = (rawManifest: string, manifests: any): void => {
    this.setState({
      rawManifest,
    });
    this.props.formik.setFieldValue('manifests', manifests);
  };

  private onManifestArtifactSelected = (expectedArtifactId: string): void => {
    this.props.formik.setFieldValue('manifestArtifactId', expectedArtifactId);
    this.props.formik.setFieldValue('manifestArtifact', null);
  };

  private onManifestArtifactEdited = (artifact: IArtifact) => {
    this.props.formik.setFieldValue('manifestArtifactId', null);
    this.props.formik.setFieldValue('manifestArtifact', artifact);
  };

  private getRequiredArtifacts = (): IManifestBindArtifact[] => {
    const { requiredArtifactIds, requiredArtifacts } = this.props.formik.values;
    return (requiredArtifactIds || [])
      .map((id: string) => ({ expectedArtifactId: id }))
      .concat(requiredArtifacts || []);
  };

  private onRequiredArtifactsChanged = (bindings: IManifestBindArtifact[]): void => {
    this.props.formik.setFieldValue(
      'requiredArtifactIds',
      bindings.filter((b) => b.expectedArtifactId).map((b) => b.expectedArtifactId),
    );
    this.props.formik.setFieldValue(
      'requiredArtifacts',
      bindings.filter((b) => b.artifact),
    );
  };

  private overrideNamespaceChange(checked: boolean) {
    if (!checked) {
      this.props.formik.setFieldValue('namespaceOverride', '');
    }
    this.setState({ overrideNamespace: checked });
  }

  // Run Job Manifest Stage
  public outputOptions = [
    { label: 'None', value: 'none' },
    { label: 'Logs', value: 'propertyFile' },
    { label: 'Artifact', value: 'artifact' },
  ];

  public accountChanged = (account: string) => {
    this.props.updateStageField({
      credentials: account,
      account: account,
    });
  };

  public handleRawManifestChangeRunJobManifest = (rawManifest: string, manifests: any) => {
    if (manifests) {
      this.props.updateStageField({ manifest: manifests[0] });
    }
    this.setState({ rawManifest });
  };

  private sourceChanged = (event: any) => {
    this.props.updateStageField({ consumeArtifactSource: event.value });
    if (event.value === 'none') {
      this.props.updateStageField({ propertyFile: null });
    }
  };

  private onArtifactSelected = (artifact: IExpectedArtifact) => {
    this.props.updateStageField({ consumeArtifactId: artifact.id });
  };

  private onArtifactEdited = (artifact: IArtifact) => {
    this.props.updateStageField({
      consumeArtifact: artifact,
      consumeArtifactId: artifact.id,
      consumeArtifactAccount: artifact.artifactAccount,
    });
  };

  private onManifestArtifactSelectedRunJobManifest = (expectedArtifactId: string): void => {
    this.props.updateStageField({
      manifestArtifactId: expectedArtifactId,
      manifestArtifact: null,
    });
  };

  private onManifestArtifactEditedRunJobManifest = (artifact: IArtifact) => {
    this.props.updateStageField({
      manifestArtifactId: null,
      manifestArtifact: artifact,
    });
  };

  private updatePropertyFile = (event: any) => {
    this.props.updateStageField({ propertyFile: event.target.value });
  };

  public logSourceForm() {
    const { stage } = this.props;
    return (
      <StageConfigField label="Container Name" helpKey="kubernetes.runJob.captureSource.containerName">
        <input
          className="form-control input-sm"
          type="text"
          value={stage.propertyFile}
          onChange={this.updatePropertyFile}
        />
      </StageConfigField>
    );
  }

  public artifactForm() {
    const { stage, pipeline } = this.props;
    return (
      <StageConfigField label="Artifact">
        <StageArtifactSelector
          pipeline={pipeline}
          stage={stage}
          artifact={stage.consumeArtifact}
          excludedArtifactTypePatterns={[]}
          expectedArtifactId={stage.consumeArtifactId}
          onExpectedArtifactSelected={this.onArtifactSelected}
          onArtifactEdited={this.onArtifactEdited}
        />
      </StageConfigField>
    );
  }

  private getSourceOptionsRunJobManifest = (): Array<Option<string>> => {
    return map([ManifestSource.TEXT, ManifestSource.ARTIFACT], (option) => ({
      label: capitalize(option),
      value: option,
    }));
  };

  private getRequiredArtifactsRunJobManifest = (): IManifestBindArtifact[] => {
    const { requiredArtifactIds, requiredArtifacts } = this.props.stage;
    return (requiredArtifactIds || [])
      .map((id: string) => ({ expectedArtifactId: id }))
      .concat(requiredArtifacts || []);
  };

  private onRequiredArtifactsChangedRunJobManifest = (bindings: IManifestBindArtifact[]): void => {
    this.props.updateStageField({
      requiredArtifactIds: bindings.filter((b) => b.expectedArtifactId).map((b) => b.expectedArtifactId),
    });
    this.props.updateStageField({ requiredArtifacts: bindings.filter((b) => b.artifact) });
  };

  public render() {
    const deploystage = this.props.formik.values;
    const { stage } = this.props;
    // console.log(this.props);
    let outputSource = <div />;
    if (stage?.consumeArtifactSource === 'propertyFile') {
      outputSource = this.logSourceForm();
    } else if (stage?.consumeArtifactSource === 'artifact') {
      outputSource = this.artifactForm();
    }

    return (
      <div className="container-fluid form-horizontal">
        <h3>
          <b>Deploy Manifest Stage Configuration</b>
        </h3>
        <h4>Basic Settings</h4>
        <ManifestBasicSettings
          accounts={this.props.accounts}
          onAccountSelect={(accountName) => this.props.formik.setFieldValue('account', accountName)}
          selectedAccount={deploystage.account}
        />
        <StageConfigField label="Override Namespace">
          <CheckboxInput
            checked={this.state.overrideNamespace}
            onChange={(e: any) => this.overrideNamespaceChange(e.target.checked)}
          />
        </StageConfigField>
        {this.state.overrideNamespace && (
          <StageConfigField label="Namespace">
            <NamespaceSelector
              createable={true}
              accounts={this.props.accounts}
              selectedAccount={deploystage.account}
              selectedNamespace={deploystage.namespaceOverride || ''}
              onChange={(namespace) => this.props.formik.setFieldValue('namespaceOverride', namespace)}
            />
          </StageConfigField>
        )}
        <hr />
        <h4>Manifest Configuration</h4>
        <StageConfigField label="Manifest Source" helpKey="kubernetes.manifest.source">
          <RadioButtonInput
            options={this.getSourceOptions()}
            onChange={(e: any) => this.props.formik.setFieldValue('source', e.target.value)}
            value={deploystage.source}
          />
        </StageConfigField>
        {deploystage?.source === ManifestSource.TEXT && (
          <StageConfigField label="Manifest">
            <CopyFromTemplateButton application={this.props.application} handleCopy={this.handleCopy} />
            <YamlEditor onChange={this.handleRawManifestChange} value={this.state.rawManifest} />
          </StageConfigField>
        )}
        {deploystage?.source === ManifestSource.ARTIFACT && (
          <>
            <StageArtifactSelectorDelegate
              artifact={deploystage.manifestArtifact}
              excludedArtifactTypePatterns={this.excludedManifestArtifactTypes}
              expectedArtifactId={deploystage.manifestArtifactId}
              helpKey="kubernetes.manifest.expectedArtifact"
              label="Manifest Artifact"
              onArtifactEdited={this.onManifestArtifactEdited}
              onExpectedArtifactSelected={(artifact: IExpectedArtifact) => this.onManifestArtifactSelected(artifact.id)}
              pipeline={this.props.pipeline}
              stage={deploystage}
            />
            <StageConfigField label="Expression Evaluation" helpKey="kubernetes.manifest.skipExpressionEvaluation">
              <CheckboxInput
                checked={deploystage.skipExpressionEvaluation === true}
                onChange={(e: any) => this.props.formik.setFieldValue('skipExpressionEvaluation', e.target.checked)}
                text="Skip SpEL expression evaluation"
              />
            </StageConfigField>
          </>
        )}
        <StageConfigField label="Required Artifacts to Bind" helpKey="kubernetes.manifest.requiredArtifactsToBind">
          <ManifestBindArtifactsSelector
            bindings={this.getRequiredArtifacts()}
            onChangeBindings={this.onRequiredArtifactsChanged}
            pipeline={this.props.pipeline}
            stage={deploystage}
          />
        </StageConfigField>
        <hr />
        <ManifestDeploymentOptions
          accounts={this.props.accounts}
          config={deploystage.trafficManagement}
          onConfigChange={(config) => this.props.formik.setFieldValue('trafficManagement', config)}
          selectedAccount={deploystage.account}
        />

        <hr />
        <h3>
          <b>Run Job Manifest Stage Configuration</b>
        </h3>
        <h4>Basic Settings</h4>
        <ManifestBasicSettings
          selectedAccount={stage?.account || ''}
          accounts={this.runstate.credentials}
          onAccountSelect={(selectedAccount: string) => this.accountChanged(selectedAccount)}
        />

        <hr />
        <h4>Manifest Configuration</h4>
        <StageConfigField label="Manifest Source" helpKey="kubernetes.manifest.source">
          <RadioButtonInput
            options={this.getSourceOptionsRunJobManifest()}
            onChange={(e: any) => this.props.updateStageField({ source: e.target.value })}
            // onChange = {(e: any) => {console.log(stage?.source)}}
            value={stage?.source}
          />
        </StageConfigField>
        {stage?.source === ManifestSource.TEXT && (
          <YamlEditor value={this.runstate.rawManifest} onChange={this.handleRawManifestChangeRunJobManifest} />
        )}
        {stage?.source === ManifestSource.ARTIFACT && (
          <>
            <StageArtifactSelectorDelegate
              artifact={stage.manifestArtifact}
              excludedArtifactTypePatterns={this.excludedManifestArtifactTypes}
              expectedArtifactId={stage.manifestArtifactId}
              helpKey="kubernetes.manifest.expectedArtifact"
              label="Manifest Artifact"
              onArtifactEdited={this.onManifestArtifactEditedRunJobManifest}
              onExpectedArtifactSelected={(artifact: IExpectedArtifact) =>
                this.onManifestArtifactSelectedRunJobManifest(artifact.id)
              }
              pipeline={this.props.pipeline}
              stage={stage}
            />
          </>
        )}
        {/* <StageConfigField label="Required Artifacts to Bind" helpKey="kubernetes.manifest.requiredArtifactsToBind">
          <ManifestBindArtifactsSelector
            bindings={this.getRequiredArtifactsRunJobManifest()}
            onChangeBindings={this.onRequiredArtifactsChangedRunJobManifest}
            pipeline={this.props.pipeline}
            stage={stage}
          />
        </StageConfigField> */}
        <h4>Output</h4>
        <StageConfigField label="Capture Output From" helpKey="kubernetes.runJob.captureSource">
          <div>
            <Select
              clearable={false}
              options={this.outputOptions}
              value={stage?.consumeArtifactSource}
              onChange={this.sourceChanged}
            />
          </div>
        </StageConfigField>
        {outputSource}

        {/* <h4>Manifest Configuration</h4>
        <StageConfigField label="Manifest Source" helpKey="kubernetes.manifest.source">
          <RadioButtonInput
            options={this.getSourceOptionsRunJobManifest()}
            onChange={(e: any) => this.props.updateStageField({ source: e?.target.value })}
            value={stage?.source}
          />
        </StageConfigField>
        {stage?.source === ManifestSource.TEXT && (
          <YamlEditor value={this.runstate.rawManifest} onChange={this.handleRawManifestChangeRunJobManifest} />
        )}
        {stage?.source === ManifestSource.ARTIFACT && (
          <>
            <StageArtifactSelectorDelegate
              artifact={stage.manifestArtifact}
              excludedArtifactTypePatterns={this.excludedManifestArtifactTypes}
              expectedArtifactId={stage.manifestArtifactId}
              helpKey="kubernetes.manifest.expectedArtifact"
              label="Manifest Artifact"
              onArtifactEdited={this.onManifestArtifactEditedRunJobManifest}
              onExpectedArtifactSelected={(artifact: IExpectedArtifact) => this.onManifestArtifactSelectedRunJobManifest(artifact.id)}
              pipeline={this.props.pipeline}
              stage={stage}
            />
          </>
        )}
        <StageConfigField label="Required Artifacts to Bind" helpKey="kubernetes.manifest.requiredArtifactsToBind">
          <ManifestBindArtifactsSelector
            bindings={this.getRequiredArtifactsRunJobManifest()}
            onChangeBindings={this.onRequiredArtifactsChangedRunJobManifest}
            pipeline={this.props.pipeline}
            stage={stage}
          />
        </StageConfigField>
        <h4>Output</h4>
        <StageConfigField label="Capture Output From" helpKey="kubernetes.runJob.captureSource">
          <div>
            <Select
              clearable={false}
              options={this.outputOptions}
              value={stage.consumeArtifactSource}
              onChange={this.sourceChanged}
            />
          </div>
        </StageConfigField> */}
        {/* {outputSource} */}
        <hr />
        <h3>
          <b>Check Preconditions Configuration</b>
        </h3>
        <StageConfigField label="Preconditions">
          <table className="table table-condensed">
            <thead>
              <tr>
                <th>Type</th>
                <th className="precondition-details">Details</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tfoot>
              <tr>
                <td color="7">
                  <button className="btn btn-block add-new" ng-click="preconditionListCtrl.addPrecondition(strategy)">
                    <span className="glyphicon glyphicon-plus-sign"></span> Add Precondition
                  </button>
                </td>
              </tr>
            </tfoot>
          </table>
        </StageConfigField>
      </div>
    );
  }
}

// export function DeployFetchTestIdDisplayFitResultsStageForm(props: IFormikStageConfigInjectedProps) {
//     return (
//       <div className="form-horizontal">
//         <h3>
//           <b>Deploy Stage</b>
//         </h3>
//         <h4> Basic Settings </h4>
//         <FormikFormField
//           name="account"
//           label="Account"
//           required={true}
//           input={(inputProps: IFormInputProps) => <ReactSelectInput {...inputProps} />}
//         />
//         <FormikFormField
//           name="OverrideNamespace"
//           label="Override Namespace"
//           input={(props) => <CheckboxInput text={''} {...props} />}
//         />
//       </div>
//     );
//   }
