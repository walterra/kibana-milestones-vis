import { PluginInitializerContext } from '../../../src/core/public';
import { MilestonesPlugin as Plugin } from './plugin';

export function plugin(initializerContext: PluginInitializerContext) {
  return new Plugin(initializerContext);
}
