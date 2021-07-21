package com.salesforce.sfcd.sdpl;

import com.netflix.spinnaker.orca.api.pipeline.Task;
import com.netflix.spinnaker.orca.api.pipeline.graph.StageDefinitionBuilder;
import com.netflix.spinnaker.orca.api.pipeline.graph.TaskNode;
import com.netflix.spinnaker.orca.api.pipeline.models.StageExecution;
import com.netflix.spinnaker.orca.clouddriver.tasks.MonitorKatoTask;
import com.netflix.spinnaker.orca.clouddriver.tasks.artifacts.CleanupArtifactsTask;
import com.netflix.spinnaker.orca.clouddriver.tasks.manifest.DeployManifestTask;
import com.netflix.spinnaker.orca.clouddriver.tasks.manifest.PromoteManifestKatoOutputsTask;
import com.netflix.spinnaker.orca.clouddriver.tasks.manifest.ResolveDeploySourceManifestTask;
import com.netflix.spinnaker.orca.clouddriver.tasks.manifest.WaitForManifestStableTask;
import com.netflix.spinnaker.orca.pipeline.tasks.PreconditionTask;
import com.netflix.spinnaker.orca.pipeline.tasks.artifacts.BindProducedArtifactsTask;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import javax.annotation.Nonnull;
import java.util.List;

import static java.lang.String.format;

/**
 * Custom stage definition that performs the three actions (deployment of baked machine image,
 * fetch test ID, display FIT results using the test ID) in a series.
 */
@Component
@StageDefinitionBuilder.Aliases({"DeployFetchTestIdDisplayFitResults"})
// The above name "DeployFetchTestIdDisplayFitResults" must be same in three places:
// 1. In the bean list in FitResultsSpringLoaderPlugin.java
// 2. In the value corresponding to the key in DeployFetchTestIdDisplayFitResults.tsx (Deck component)
// 3. In the extensions in orca-local.yml file present in ~/.hal/default/profiles
public class DeployFetchTestIdDisplayFitResults implements StageDefinitionBuilder {

    private static Logger logger = LoggerFactory.getLogger(DeployFetchTestIdDisplayFitResults.class);

    public static final String PIPELINE_CONFIG_TYPE = "checkPreconditions";

    private List<? extends PreconditionTask> preconditionTasks;

    public DeployFetchTestIdDisplayFitResults(){
        logger.info("No-Arg Constructor");
    }

    public DeployFetchTestIdDisplayFitResults(List<? extends PreconditionTask> preconditionTasks) {
        logger.info("Initialize precondition tasks");
        this.preconditionTasks = preconditionTasks;
    }

    @Override
    public void taskGraph(@Nonnull StageExecution stage, @Nonnull TaskNode.Builder builder) {
        logger.info("FitResultsSpringLoaderPlugin starting");

        logger.info("taskGraph to perform Deployment Action");
        builder.withTask(ResolveDeploySourceManifestTask.TASK_NAME, ResolveDeploySourceManifestTask.class);
        builder.withTask(DeployManifestTask.TASK_NAME, DeployManifestTask.class);
        builder.withTask("monitorDeploy", MonitorKatoTask.class);
        builder.withTask(PromoteManifestKatoOutputsTask.TASK_NAME, PromoteManifestKatoOutputsTask.class);
        builder.withTask(WaitForManifestStableTask.TASK_NAME, WaitForManifestStableTask.class);
        builder.withTask(CleanupArtifactsTask.TASK_NAME, CleanupArtifactsTask.class);
        builder.withTask("monitorCleanup", MonitorKatoTask.class);
        builder.withTask(PromoteManifestKatoOutputsTask.TASK_NAME, PromoteManifestKatoOutputsTask.class);
        builder.withTask(BindProducedArtifactsTask.TASK_NAME, BindProducedArtifactsTask.class);

        logger.info("taskGraph to perform Run Manifest Action");
        builder.withTask(RunManifestTask.TASK_NAME, RunManifestTask.class);

        logger.info("taskGraph to perform Check Preconditions Action");
        if (!isTopLevelStage(stage)) {
            String preconditionType = stage.getContext().get("preconditionType").toString();
            if (preconditionType == null) {
                throw new IllegalStateException(format("no preconditionType specified for stage %s", stage.getId()));
            }
            Task preconditionTask = preconditionTasks.stream().filter(it -> it.getPreconditionType().equals(preconditionType)).findFirst()
                            .orElseThrow(() -> new IllegalStateException(format("no precondition implementation for type %s", preconditionType)));
            builder.withTask("checkPrecondition", preconditionTask.getClass());
        }

        logger.info("FitResultsSpringLoaderPlugin ending");
    }

    private boolean isTopLevelStage(StageExecution stage) {
        return stage.getParentStageId() == null;
    }
}
