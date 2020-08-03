import { PluginInitializerContext, CoreSetup, CoreStart, Plugin, UiSettingsClientContract } from 'kibana/public';
import { LegacyDependenciesPlugin, LegacyDependenciesPluginSetup } from './shim';
import { VisualizationsSetup } from '../../../src/legacy/core_plugins/visualizations/public';

import { createMilestonesTypeDefinition } from './milestones_vis_type';

/** @internal */
export interface MilestonesVisualizationDependencies extends LegacyDependenciesPluginSetup {
  uiSettings: UiSettingsClientContract;
}

/** @internal */
export interface MilestonesPluginSetupDependencies {
  visualizations: VisualizationsSetup;
  __LEGACY: LegacyDependenciesPlugin;
}

/** @internal */
export class MilestonesPlugin implements Plugin<void, void> {
  initializerContext: PluginInitializerContext;

  constructor(initializerContext: PluginInitializerContext) {
    this.initializerContext = initializerContext;
  }

  public async setup(core: CoreSetup, { visualizations, __LEGACY }: MilestonesPluginSetupDependencies) {
    const visualizationDependencies: Readonly<MilestonesVisualizationDependencies> = {
      uiSettings: core.uiSettings,
      ...(await __LEGACY.setup()),
    };
    visualizations.types.VisTypesRegistryProvider.register(() => createMilestonesTypeDefinition(visualizationDependencies));
  }

  public start(core: CoreStart) {
    // nothing to do here yet
  }
}
