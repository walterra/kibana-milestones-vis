import d3 from 'd3';
import milestones from 'd3-milestones';

class Milestones {
  constructor(el, vis) {
    this.vis = vis;
    this.el = el;
    this.resize();

    this._intervalMapping = {
      s: 'second',
      m: 'minute',
      h: 'hour',
      d: 'day',
      w: 'week',
      M: 'month',
      q: 'quarter',
      y: 'year'
    };

    this._options = {
      mapping_timestamp: 'timestamp',
      mapping_text: 'text',
      optimize: true,
      // e.g. "2015-01-26T06:40:36.181"
      parseTime: '%Y-%m-%dT%H:%M:%S.%L'
    };

  }

  render(visData, status) {
    return new Promise(resolve => {
      // hacky to remove the whole DOM, library needs to fix proper updates
      d3.select(this.el).selectAll('.milestones-vis').remove();
      const element = d3.select(this.el).append('div')
        .classed('milestones-vis', true).node();

      const data = visData.data || [];
      const useCategories = (Array.isArray(data) && data.length > 0 && typeof data[0].category !== 'undefined');

      const milestonesLayoutGenerator = milestones(element)
        .mapping({
          category: useCategories ? 'category' : undefined,
          entries: useCategories ? 'entries' : undefined,
          timestamp: this._options.mapping_timestamp,
          text: this._options.mapping_text
        })
        .parseTime(this._options.parseTime)
        .useLabels(this.vis.params.layout.showLabels)
        .distribution(this.vis.params.layout.distribution)
        .optimize(this._options.optimize);

      if (typeof visData.interval !== 'undefined') {
        milestonesLayoutGenerator.aggregateBy(this._intervalMapping[visData.interval]);
      }

      milestonesLayoutGenerator.render(data);
      resolve('done rendering');
    });
  }

  // milestones handles resizing itself
  resize() {
    return;
  }

  destroy() {
    this.el.innerHTML = '';
  }
}

export default Milestones;
