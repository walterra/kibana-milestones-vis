/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import { PluginInitializerContext, CoreSetup, CoreStart, Plugin } from 'kibana/public';

import { DataPublicPluginSetup, DataPublicPluginStart } from '../../../src/plugins/data/public';
import { Plugin as ExpressionsPublicPlugin } from '../../../src/plugins/expressions/public';
import { VisualizationsSetup } from '../../../src/plugins/visualizations/public';

import { createMilestonesFn } from './milestones_fn';
import { createMilestonesTypeDefinition } from './milestones_type';
import { getMilestonesVisRenderer } from './milestones_vis_renderer';
import { setData } from './services';

/** @internal */
export interface MilestonesVisualizationDependencies {
  core: CoreSetup;
  plugins: { data: DataPublicPluginSetup };
}

/** @internal */
export interface MilestonesPluginSetupDependencies {
  data: DataPublicPluginSetup;
  expressions: ReturnType<ExpressionsPublicPlugin['setup']>;
  visualizations: VisualizationsSetup;
}

/** @internal */
export interface MilestonesPluginStartDependencies {
  data: DataPublicPluginStart;
}

/** @internal */
export class MilestonesPlugin implements Plugin<void, void> {
  initializerContext: PluginInitializerContext;

  constructor(initializerContext: PluginInitializerContext) {
    this.initializerContext = initializerContext;
  }

  public async setup(
    core: CoreSetup,
    { data, expressions, visualizations }: MilestonesPluginSetupDependencies
  ) {
    const visualizationDependencies: Readonly<MilestonesVisualizationDependencies> = {
      core,
      plugins: {
        data,
      },
    };

    expressions.registerFunction(() => createMilestonesFn(visualizationDependencies));
    expressions.registerRenderer(getMilestonesVisRenderer());

    visualizations.createBaseVisualization(createMilestonesTypeDefinition());
  }

  public start(core: CoreStart, { data }: MilestonesPluginStartDependencies) {
    setData(data);
  }
}
