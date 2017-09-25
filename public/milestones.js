import d3 from 'd3';
import milestones from 'milestones';

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
      // e.g. "2017-02-07T03:00:00.000+01:00"
      parseTime: '%Y-%m-%dT%H:%M:%S'
    };

    d3.select(this.el).classed('milestones-vis', true);
  }

  render(visData, status) {
    const element = this.el;
    return new Promise(resolve => {
      // hacky to remove the whole DOM, library needs to fix proper updates
      d3.select(element).selectAll('.milestones').remove();

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
    console.log('destroy milestones');
    this.el.innerHTML = '';
  }
}

export default Milestones;
