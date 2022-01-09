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

import React, { useEffect, FC } from 'react';
import d3 from 'd3';
import { Milestones } from 'react-milestones-vis';

import { MilestonesVisParams } from './types';

import './milestones_visualization.scss';

interface RawDataItem {
  category?: string;
  timestamp: number;
  text: string;
}

interface DataItem extends RawDataItem {
  date: string;
}

export interface RawVisData {
  data: RawDataItem[];
}

function timeFormat(timestamp: number) {
  const tzoffset = new Date(timestamp).getTimezoneOffset() * 60000; // offset in milliseconds
  const localISOTime = new Date(timestamp - tzoffset).toISOString().slice(0, -1);
  // e.g. '2015-01-26T06:40:36.181'
  return localISOTime;
}

function isUsingCategories(data: unknown): data is Array<Required<DataItem>> {
  return Array.isArray(data) && data.length > 0 && typeof data[0].category !== 'undefined';
}

const options = {
  mapping_timestamp: 'date',
  mapping_text: 'text',
  optimize: true,
  // e.g. "2015-01-26T06:40:36.181"
  parseTime: '%Y-%m-%dT%H:%M:%S.%L',
};

interface MilestonesVisualizationProps {
  renderComplete: () => void;
  visData: RawVisData;
  visConfig: MilestonesVisParams;
}

export const MilestonesVisualization: FC<MilestonesVisualizationProps> = ({
  renderComplete,
  visData,
  visConfig,
}) => {
  useEffect(() => {
    renderComplete();
  }, []);

  const data = (visData.data || [])
    // data prep
    .map((d) => {
      if (d.text === undefined) {
        d.text = '<no title>';
      }
      const item: DataItem = {
        ...d,
        date: timeFormat(d.timestamp),
      };

      return item;
    })
    // remove duplicates
    .reduce<DataItem[]>((p, c) => {
      const exists = p.some((d: DataItem) => d.date === c.date && d.text === c.text);

      if (!exists) {
        p.push(c);
      }

      return p;
    }, []);

  return (
    <div className="milestones-vis">
      <Milestones
        data={
          isUsingCategories(data)
            ? d3
                .nest<Required<DataItem>>()
                .key((d) => d.category)
                .entries(data)
            : data
        }
        mapping={{
          category: isUsingCategories(data) ? 'key' : undefined,
          entries: isUsingCategories(data) ? 'values' : undefined,
          timestamp: options.mapping_timestamp,
          text: options.mapping_text,
        }}
        parseTime={options.parseTime}
        useLabels={visConfig.showLabels}
        distribution={visConfig.distribution}
        optimize={options.optimize}
        orientation={visConfig.orientation}
        aggregateBy={visConfig.interval}
      />
    </div>
  );
};
