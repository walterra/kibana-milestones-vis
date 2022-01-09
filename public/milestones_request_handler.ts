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

import { Filter, esQuery, TimeRange, Query } from '../../../src/plugins/data/public';

import { NONE_SELECTED, SERVER_SEARCH_ROUTE_PATH } from '../common';

import { MilestonesVisualizationDependencies } from './plugin';
import { getData } from './services';
import { MilestonesVisParams } from './types';

interface MilestonesRequestHandlerParams {
  query: Query;
  filters: Filter;
  timeRange: TimeRange;
  visParams: MilestonesVisParams;
}

export function createMilestonesRequestHandler({
  core: { http, uiSettings },
}: MilestonesVisualizationDependencies) {
  const { indexPatterns } = getData();

  return async ({ timeRange, filters, query, visParams }: MilestonesRequestHandlerParams) => {
    const index = await indexPatterns.get(visParams.indexPatternId);
    const esQueryConfigs = esQuery.getEsQueryConfig(uiSettings);
    const filtersDsl = esQuery.buildEsQuery(undefined, query, filters, esQueryConfigs);

    if (visParams.labelField === undefined || visParams.labelField === NONE_SELECTED) {
      return {
        timeFieldName: index.timeFieldName,
        data: [],
      };
    }

    return await http.post(SERVER_SEARCH_ROUTE_PATH, {
      body: JSON.stringify({
        categoryField: visParams.categoryField,
        filtersDsl,
        index: index.title,
        labelField: visParams.labelField,
        maxDocuments: visParams.maxDocuments,
        sortField: visParams.sortField,
        sortOrder: visParams.sortOrder,
        timeFieldName: index.timeFieldName,
        timeRangeFrom: timeRange.from,
        timeRangeTo: timeRange.to,
      }),
    });
  };
}
