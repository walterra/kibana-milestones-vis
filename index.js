import { resolve } from 'path';
import { existsSync } from 'fs';

export default function (kibana) {
  return new kibana.Plugin({
    require: ['elasticsearch'],
    name: 'kibana_milestones_vis',
    uiExports: {
      visTypes: ['plugins/kibana_milestones_vis/milestones_vis_type'],
      styleSheetPaths: [
        resolve(__dirname, 'public/index.scss'),
        resolve(__dirname, 'public/index.css')
      ].find(p => existsSync(p)),
    },

    config(Joi) {
      return Joi.object({
        enabled: Joi.boolean().default(true),
      }).default();
    },
  });
}
