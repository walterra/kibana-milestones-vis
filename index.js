export default function (kibana) {
  return new kibana.Plugin({
    name: 'milestones',
    require: ['kibana', 'elasticsearch'],
    uiExports: {
      visTypes: ['plugins/milestones/milestones_vis']
    },
    config(Joi) {
      return Joi.object({
        enabled: Joi.boolean().default(true),
      }).default();
    },
  });
}
