import { PluginInitializerContext, CoreSetup, CoreStart, Plugin } from 'kibana/public';

import { DataPublicPluginSetup, DataPublicPluginStart } from '../../../src/plugins/data/public';
import { Plugin as ExpressionsPublicPlugin } from '../../../src/plugins/expressions/public';
import { VisualizationsSetup } from '../../../src/plugins/visualizations/public';

import { createMilestonesFn } from './milestones_function';
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

  public stop() {}
}
