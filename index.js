import { resolve } from 'path';

export default kibana => new kibana.Plugin({
  id: 'kibana_milestones_vis',
  require: ['elasticsearch'],

  uiExports: {
    visTypes: ['plugins/kibana_milestones_vis/milestones_vis_type'],
    styleSheetPaths: resolve(__dirname, 'public/index.scss'),
  },

  config: (Joi) => Joi.object({
    enabled: Joi.boolean().default(true),
    enableExternalUrls: Joi.boolean().default(false)
  }).default(),

});
