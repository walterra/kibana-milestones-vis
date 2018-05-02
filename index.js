export default kibana => new kibana.Plugin({
  id: 'kibana-milestones-vis',
  require: ['elasticsearch'],

  uiExports: {
    visTypes: ['plugins/kibana-milestones-vis/milestones_vis']
  },

  config(Joi) {
    return Joi.object({
      enabled: Joi.boolean().default(true),
    }).default();
  },

});
