/*
 * Copyright 2021 Netflix, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package com.salesforce.sfcd.sdpl;

import com.netflix.spinnaker.kork.plugins.api.spring.SpringLoaderPlugin;
import com.salesforce.sfcd.sdpl.DeployFetchTestIdDisplayFitResults;
import org.pf4j.PluginWrapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.apache.commons.lang3.tuple.Pair;
import org.springframework.beans.factory.config.BeanDefinition;
import org.springframework.beans.factory.support.BeanDefinitionBuilder;
import org.springframework.beans.factory.support.BeanDefinitionReaderUtils;
import org.springframework.beans.factory.support.BeanDefinitionRegistry;

import java.util.Arrays;
import java.util.List;


/**
*  Creates custom plugin
*/
public class FitResultsSpringLoaderPlugin extends SpringLoaderPlugin {

    public static Logger logger = LoggerFactory.getLogger(FitResultsSpringLoaderPlugin.class);

    public FitResultsSpringLoaderPlugin(PluginWrapper wrapper){
        super(wrapper);
    }

    /**
     * Creating bean definition using our custom stage definition class and registering it to the application's registry.
     */
    @Override
    public void registerBeanDefinitions(BeanDefinitionRegistry beanDefinitionRegistry){
        List<Pair<String, Class>> beanList = Arrays.asList(
                Pair.of("DeployFetchTestIdDisplayFitResults", DeployFetchTestIdDisplayFitResults.class)
        );
        for(Pair<String, Class> bean: beanList){
            BeanDefinition beanDefinition = primaryBeanDefinitionFor(bean.getRight());
            logger.info("Registering new "+ beanDefinition.getBeanClassName() + "bean to the registry");
            beanDefinitionRegistry.registerBeanDefinition(bean.getLeft(), beanDefinition);
        }
        super.registerBeanDefinitions(beanDefinitionRegistry);
    }

    /**
     * Adding the list of plugin packages that have to be scanned for beans
     */
    @Override
    public List<String> getPackagesToScan() {
        return Arrays.asList("com.salesforce.sfcd.sdpl");
    }
}
