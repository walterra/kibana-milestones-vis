import d3 from 'd3';
import milestones from 'd3-milestones';

function timeFormat(timestamp) {
  const tzoffset = (new Date(timestamp)).getTimezoneOffset() * 60000; //offset in milliseconds
  const localISOTime = (new Date(timestamp - tzoffset)).toISOString().slice(0, -1);
  // e.g. '2015-01-26T06:40:36.181'
  return localISOTime;
}

class MilestonesVisualization {
  constructor(el, vis) {
    this.vis = vis;
    this.el = el;
    this.resize();

    this._options = {
      mapping_timestamp: 'date',
      mapping_text: 'text',
      optimize: true,
      // e.g. "2015-01-26T06:40:36.181"
      parseTime: '%Y-%m-%dT%H:%M:%S.%L'
    };

  }

  async render(rawVisData, visParams, status) {
    if (!(status.resize || status.data || status.params)) return;

    d3.select(this.el).selectAll('.milestones-vis').remove();
    const element = d3.select(this.el).append('div')
      .classed('milestones-vis', true).node();

    const data = (rawVisData.data || []).map(d => {
      d.date = timeFormat(d.timestamp)
      return d;
    });
    const useCategories = (Array.isArray(data) && data.length > 0 && typeof data[0].category !== 'undefined');

    let categorizedData;

    if (useCategories) {
      categorizedData = d3.nest()
        .key(d => d.category)
        .entries(data);
    }

    const milestonesLayoutGenerator = milestones(element)
      .mapping({
        category: useCategories ? 'key' : undefined,
        entries: useCategories ? 'values' : undefined,
        timestamp: this._options.mapping_timestamp,
        text: this._options.mapping_text,
      })
      .parseTime(this._options.parseTime)
      .useLabels(this.vis.params.showLabels)
      .distribution(this.vis.params.distribution)
      .optimize(this._options.optimize);

    if (typeof visParams.interval !== 'undefined') {
      milestonesLayoutGenerator.aggregateBy(visParams.interval);
    }

    milestonesLayoutGenerator.render((useCategories) ? categorizedData : data);
  }

  // milestones handles resizing itself
  resize() {
    return;
  }

  destroy() {
    this.el.innerHTML = '';
  }
}

export default MilestonesVisualization;
