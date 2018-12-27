export default function (kibana) {
  return new kibana.Plugin({
    require: ['elasticsearch'],
    name: 'kibana-milestones-vis',
    uiExports: {
      visTypes: ['plugins/kibana-milestones-vis/milestones_vis']
    },

    config(Joi) {
      return Joi.object({
        enabled: Joi.boolean().default(true),
      }).default();
    },
  });
}
