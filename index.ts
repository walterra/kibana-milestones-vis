import { resolve } from 'path';
import { existsSync } from 'fs';

import { Legacy } from '../../kibana';

import { LegacyPluginApi, LegacyPluginInitializer } from '../../src/legacy/types';

const milestonesPluginInitializer: LegacyPluginInitializer = ({ Plugin }: LegacyPluginApi) =>
  new Plugin({
    id: 'kibana_milestones_vis',
    require: ['kibana', 'elasticsearch', 'visualizations', 'interpreter', 'data'],
    publicDir: resolve(__dirname, 'public'),
    uiExports: {
      styleSheetPaths: [
        resolve(__dirname, 'public/index.scss'),
        resolve(__dirname, 'public/index.css')
      ].find(p => existsSync(p)),
      hacks: [resolve(__dirname, 'public/legacy')],
      injectDefaultVars: server => ({}),
    },
    init: (server: Legacy.Server) => ({}),
    config(Joi: any) {
      return Joi.object({
        enabled: Joi.boolean().default(true),
      }).default();
    },
  } as Legacy.PluginSpecOptions);

// eslint-disable-next-line import/no-default-export
export default milestonesPluginInitializer;
