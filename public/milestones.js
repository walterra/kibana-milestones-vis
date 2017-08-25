import d3 from 'd3';
import milestones from 'milestones';
import { EventEmitter } from 'events';

class Milestones extends EventEmitter {

  constructor(domNode) {
    super();

    //DOM
    this._element = domNode;
    this.resize();

    //MAPPING
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

    //SETTING (non-configurable)

    //OPTIONS
    this._options = {
      mapping_timestamp: 'timestamp',
      mapping_text: 'text',
      optimize: true,
      parseTime: '%Y-%m-%dT%H:%M:%S'
    };
    this._optionsAsString = null;
    this._interval = 'minute';

    //DATA
    this._data = null;

    //UTIL
    this._setTimeoutId = null;
    this._pendingJob = null;
    this._DOMisUpdating = false;

  }

  setOptions(options) {
    if (JSON.stringify(options) === this._optionsAsString) {
      return;
    }
    this._optionsAsString = JSON.stringify(options);
    this._options = options;
    this._invalidate(false);
  }


  resize() {
    // milestones handles resizing itself
    this._invalidate(false);
    return;
  }

  setData(data) {
    this._data = data;
  }

  setInterval(interval) {
    this._interval = this._intervalMapping[interval];
  }

  destroy() {
    clearTimeout(this._setTimeoutId);
    this._element.innerHTML = '';
  }

  _isJobRunning() {
    return (this._setTimeoutId || this._DOMisUpdating);
  }

  async _processPendingJob() {
    if (!this._pendingJob) {
      return;
    }

    if (this._isJobRunning()) {
      return;
    }

    this._completedJob = null;
    const job = await this._pickPendingJob();
    if (job.data.length) {
      await this._updateDOM(job);
    } else {
      this._emptyDOM(job);
    }

    if (this._pendingJob) {
      this._processPendingJob();//pick up next job
    } else {
      this._completedJob = job;
      this.emit('renderComplete');
    }

  }

  async _pickPendingJob() {
    return await new Promise((resolve) => {
      this._setTimeoutId = setTimeout(async() => {
        const job = this._pendingJob;
        this._pendingJob = null;
        this._setTimeoutId = null;
        resolve(job);
      }, 0);
    });
  }


  _emptyDOM() {
    d3.select(this._element).selectAll('.milestones').remove();
    this._DOMisUpdating = false;
  }

  async _updateDOM(job) {
    const canSkipDomUpdate = this._pendingJob || this._setTimeoutId;
    if (canSkipDomUpdate) {
      this._DOMisUpdating = false;
      return;
    }

    this._DOMisUpdating = true;
    // hacky to remove the whole DOM, library needs to fix proper updates
    d3.select(this._element).selectAll('.milestones').remove();

    const data = job.data;
    const useCategories = (Array.isArray(data) && data.length > 0 && typeof data[0].category !== 'undefined');

    const milestonesLayoutGenerator = milestones(this._element)
      .mapping({
        category: useCategories ? 'category' : undefined,
        entries: useCategories ? 'entries' : undefined,
        timestamp: this._options.mapping_timestamp,
        text: this._options.mapping_text
      })
      .parseTime(this._options.parseTime)
      .aggregateBy(this._interval)
      .optimize(this._options.optimize);

    await new Promise((resolve) => {
      milestonesLayoutGenerator.render(job.data);
      this._DOMisUpdating = false;
      resolve(true);
    });
  }

  _makeNewJob() {
    return {
      refreshLayout: true,
      data: this._data
    };
  }

  _makeJobPreservingLayout() {
    return {
      refreshLayout: false,
      data: this._completedJob.data
    };
  }

  _invalidate(keepLayout) {
    if (!this._data) {
      return;
    }

    const canReuseLayout = keepLayout && !this._isJobRunning() && this._completedJob;
    this._pendingJob = (canReuseLayout) ? this._makeJobPreservingLayout() : this._makeNewJob();
    this._processPendingJob();
  }

  /**
   * Returns debug info. For debugging only.
   * @return {*}
   */
  getDebugInfo() {
    const debug = {};
    return debug;
  }

}

export default Milestones;
