export default function (kibana) {
  return new kibana.Plugin({
    name: 'kibana-milestones-vis',
    require: ['kibana', 'elasticsearch'],
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
