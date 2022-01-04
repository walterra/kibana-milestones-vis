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

import './index.scss';

import { PluginInitializerContext, CoreSetup, CoreStart, Plugin } from 'kibana/public';

import { VisualizationsSetup } from '../../../src/plugins/visualizations/public';

import { createMilestonesTypeDefinition } from './milestones_vis_type';

/** @internal */
export interface MilestonesVisualizationDependencies {
  core: CoreSetup;
  plugins: {};
}

/** @internal */
export interface MilestonesPluginSetupDependencies {
  visualizations: VisualizationsSetup;
}

/** @internal */
export interface MilestonesPluginStartDependencies {}

/** @internal */
export class MilestonesPlugin implements Plugin<void, void> {
  initializerContext: PluginInitializerContext;

  constructor(initializerContext: PluginInitializerContext) {
    this.initializerContext = initializerContext;
  }

  public async setup(core: CoreSetup, { visualizations }: MilestonesPluginSetupDependencies) {
    const visualizationDependencies: Readonly<MilestonesVisualizationDependencies> = {
      core,
      plugins: {},
    };
    visualizations.createBaseVisualization(
      createMilestonesTypeDefinition(visualizationDependencies)
    );
  }

  public start(core: CoreStart, {}: MilestonesPluginStartDependencies) {}
}
