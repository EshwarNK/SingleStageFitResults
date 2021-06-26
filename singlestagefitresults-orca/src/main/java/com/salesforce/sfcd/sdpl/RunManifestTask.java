package com.salesforce.sfcd.sdpl;

import com.netflix.spinnaker.orca.api.pipeline.models.StageExecution;
import com.google.common.collect.ImmutableMap;
import com.netflix.spinnaker.kork.annotations.NonnullByDefault;
import com.netflix.spinnaker.orca.api.pipeline.Task;
import com.netflix.spinnaker.orca.api.pipeline.TaskResult;
import com.netflix.spinnaker.orca.api.pipeline.models.ExecutionStatus;
import com.netflix.spinnaker.orca.clouddriver.tasks.manifest.ManifestEvaluator;
import com.netflix.spinnaker.orca.clouddriver.tasks.manifest.RunJobManifestContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import javax.annotation.Nonnull;
import java.util.List;
import java.util.Map;

/**
 * Run Manifest task
 */
@Component
@NonnullByDefault
public class RunManifestTask implements Task {

    public static final String TASK_NAME = "runManifest";

    private final ManifestEvaluator manifestEvaluator;

    @Autowired
    public RunManifestTask(ManifestEvaluator manifestEvaluator) {
        this.manifestEvaluator = manifestEvaluator;
    }

    @Nonnull
    @Override
    public TaskResult execute(@Nonnull StageExecution stage){
        RunJobManifestContext runJobManifestContext = stage.mapTo(RunJobManifestContext.class);
        ManifestEvaluator.Result result = manifestEvaluator.evaluate(stage, runJobManifestContext);
        List<Map<Object, Object>> manifests = result.getManifests();
        if (manifests.size() != 1) {
            throw new IllegalArgumentException("Run Job only supports manifests with a single Job.");
        }
        ImmutableMap<String, Object> outputs = getOutputs(result);
        return TaskResult.builder(ExecutionStatus.SUCCEEDED).context(outputs).outputs(outputs).build();
    }

    private ImmutableMap<String, Object> getOutputs(ManifestEvaluator.Result result) {
        return new ImmutableMap.Builder<String, Object>()
                .put("manifests", result.getManifests())
                .put("requiredArtifacts", result.getRequiredArtifacts())
                .put("optionalArtifacts", result.getOptionalArtifacts())
                .build();
    }
}
