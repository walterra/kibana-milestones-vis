import { PluginInitializerContext } from 'kibana/public';
import { npSetup, npStart } from 'ui/new_platform';

import { visualizations } from '../../../src/legacy/core_plugins/visualizations/public';
import { MilestonesPluginSetupDependencies } from './plugin';
import { LegacyDependenciesPlugin } from './shim';
import { plugin } from '.';

const plugins: Readonly<MilestonesPluginSetupDependencies> = {
  visualizations,
  // Temporary solution
  // It will be removed when all dependent services are migrated to the new platform.
  __LEGACY: new LegacyDependenciesPlugin(),
};

const pluginInstance = plugin({} as PluginInitializerContext);

export const setup = pluginInstance.setup(npSetup.core, plugins);
export const start = pluginInstance.start(npStart.core);
