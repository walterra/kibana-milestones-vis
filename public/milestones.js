import d3 from 'd3';
import milestones from 'milestones';
import { EventEmitter } from 'events';

class Milestones extends EventEmitter {

  constructor(domNode) {
    super();

    //DOM
    this._element = d3.select(domNode).select('.milestones-vis-wrapper').node();
    this.resize();

    //SETTING (non-configurable)

    //OPTIONS
    this._options = {
      mapping_timestamp: 'timestamp',
      mapping_text: 'text',
      optimize: true,
      parseTime: '%Y-%m-%dT%H:%M:%S',
      aggregate: 'minute'
    };
    this._optionsAsString = null;

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

  destroy() {
    clearTimeout(this._setTimeoutId);
    this._element.innerHTML = '';
  }

  getStatus() {
    return Milestones.STATUS.COMPLETE; // : Milestones.STATUS.INCOMPLETE;
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
      .aggregateBy(this._options.aggregate)
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

Milestones.STATUS = { COMPLETE: 0, INCOMPLETE: 1 };

export default Milestones;
