export default kibana => new kibana.Plugin({
  require: ['kibana', 'elasticsearch'],
  uiExports: {
    visTypes: [
      'plugins/kibana-milestones-vis/milestones_vis'
    ]
  }
});
