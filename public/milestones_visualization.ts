/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import d3 from 'd3';
// @ts-ignore
import milestones from 'd3-milestones';

interface RawVisData {
  data: any[];
}

interface DataItem {
  category: string;
  date: string;
  text: string;
}

function timeFormat(timestamp: number) {
  const tzoffset = new Date(timestamp).getTimezoneOffset() * 60000; // offset in milliseconds
  const localISOTime = new Date(timestamp - tzoffset).toISOString().slice(0, -1);
  // e.g. '2015-01-26T06:40:36.181'
  return localISOTime;
}

export const createMilestonesVisualization = () =>
  class MilestonesVisualization {
    vis: Record<string, any> | undefined = undefined;
    el: HTMLElement | undefined = undefined;
    _options = {
      mapping_timestamp: 'date',
      mapping_text: 'text',
      optimize: true,
      // e.g. "2015-01-26T06:40:36.181"
      parseTime: '%Y-%m-%dT%H:%M:%S.%L',
    };

    constructor(el: HTMLElement, vis: any) {
      this.vis = vis;
      this.el = el;
      this.resize();
    }

    async render(rawVisData: RawVisData, visParams: any, status: any) {
      if (
        this.vis === undefined ||
        this.el === undefined ||
        !(status.resize || status.data || status.params)
      )
        return;

      d3.select(this.el)
        .selectAll('.milestones-vis')
        .remove();
      const element = d3
        .select(this.el)
        .append('div')
        .classed('milestones-vis', true)
        .node();

      const data = (rawVisData.data || [])
        // data prep
        .map(d => {
          if (d.text === undefined) {
            d.text = '<no title>';
          }
          d.date = timeFormat(d.timestamp);
          return d;
        })
        // remove duplicates
        .reduce((p, c) => {
          const exists = p.some((d: DataItem) => d.date === c.date && d.text === c.text);

          if (!exists) {
            p.push(c);
          }

          return p;
        }, []);

      const useCategories =
        Array.isArray(data) && data.length > 0 && typeof data[0].category !== 'undefined';

      let categorizedData;

      if (useCategories) {
        categorizedData = d3
          .nest()
          .key((d: any) => d.category)
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
        .optimize(this._options.optimize)
        .orientation(this.vis.params.orientation);

      if (typeof visParams.interval !== 'undefined') {
        milestonesLayoutGenerator.aggregateBy(visParams.interval);
      }

      milestonesLayoutGenerator.render(useCategories ? categorizedData : data);
    }

    // milestones handles resizing itself
    resize() {
      return;
    }

    destroy() {
      if (this.el !== undefined) {
        this.el.innerHTML = '';
      }
    }
  };
