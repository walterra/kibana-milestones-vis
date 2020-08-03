import chrome from 'ui/chrome';
import 'ui/es'; // required for $injector.get('es') below
import { CoreStart, Plugin } from 'kibana/public';

/** @internal */
export interface LegacyDependenciesPluginSetup {
  es: any;
}

export class LegacyDependenciesPlugin
  implements Plugin<Promise<LegacyDependenciesPluginSetup>, void> {
  public async setup() {
    const $injector = await chrome.dangerouslyGetActiveInjector();

    return {
      // Client of Elastic Search.
      es: $injector.get('es'),
    } as LegacyDependenciesPluginSetup;
  }

  public start(core: CoreStart) {
    // nothing to do here yet
  }
}
