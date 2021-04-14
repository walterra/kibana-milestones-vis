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

// eslint-disable-next-line @kbn/eslint/no-restricted-paths
import { getSearchService } from '../../../src/plugins/data/public/services';
import { Filter, esQuery, TimeRange, Query } from '../../../src/plugins/data/public';

import { NONE_SELECTED } from './constants';
import { MilestonesVisualizationDependencies } from './plugin';

interface MilestonesRequestHandlerParams {
  index: any;
  query: Query;
  filters: Filter;
  timeRange: TimeRange;
  visParams: any;
}

export function createMilestonesRequestHandler({
  core: { uiSettings },
}: MilestonesVisualizationDependencies) {
  const { esClient } = getSearchService().__LEGACY;

  return async ({ index, timeRange, filters, query, visParams }: MilestonesRequestHandlerParams) => {
    const indexPatternTitle = index.title;
    const esQueryConfigs = esQuery.getEsQueryConfig(uiSettings);
    const filtersDsl = esQuery.buildEsQuery(undefined, query, filters, esQueryConfigs);

    if (visParams.labelField === undefined || visParams.labelField === NONE_SELECTED) {
      return {
        timeFieldName: index.timeFieldName,
        data: [],
      };
    }

    const request = {
      index: indexPatternTitle,
      body: {
        query: {
          bool: {
            must: [
              filtersDsl,
              {
                range: {
                  [index.timeFieldName]: {
                    gte: timeRange.from,
                    lt: timeRange.to,
                  },
                },
              },
            ],
          },
        },
        _source: [
          visParams.labelField,
          ...(visParams.categoryField !== undefined && visParams.categoryField !== NONE_SELECTED
            ? [visParams.categoryField]
            : []),
        ],
        script_fields: {
          milestones_timestamp: {
            script: {
              source: `doc["${index.timeFieldName}"].value.millis`,
            },
          },
        },
        size: visParams.maxDocuments,
        sort : [
          { [visParams.sortField] : {"order" : visParams.sortOrder} },
        ],
      },
    };

    const resp = await esClient.search(request);

    return {
      timeFieldName: index.timeFieldName,
      data: resp.hits.hits.map((hit: any) => ({
        timestamp: hit.fields.milestones_timestamp[0],
        text: hit._source[visParams.labelField],
        ...(visParams.categoryField !== undefined && visParams.category !== NONE_SELECTED
          ? { category: hit._source[visParams.categoryField] }
          : {}),
      })),
    };
  };
}
