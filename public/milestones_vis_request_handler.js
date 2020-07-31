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

import { timefilter } from 'ui/timefilter';
import { buildEsQuery, getEsQueryConfig } from '@kbn/es-query';

export function MilestonesVisRequestHandlerProvider(es, serviceSettings, config, esShardTimeout) {
  return {
    name: 'kibana_milestones_vis',

    async handler(req) {
      const { index, timeRange, filters, query, visParams } = req;
      const indexPatternTitle = index.title;
      const esQueryConfigs = getEsQueryConfig(config);
      const filtersDsl = buildEsQuery(undefined, query, filters, esQueryConfigs);

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
                      lt: timeRange.to
                    }
                  }
                }
              ]
            }
          },
          _source: [
            visParams.labelField,
            ...(visParams.categoryField !== undefined && visParams.category !== '--- None selected ---') ? [visParams.categoryField] : [],
          ],
          script_fields: {
            milestones_timestamp: {
              script: {
                source: `doc["${index.timeFieldName}"].value.millis`
              }
            }
          },
          size: visParams.maxDocuments
        }
      };

      const resp = await es.search(request);

      return {
        timeFieldName: index.timeFieldName,
        data: resp.hits.hits.map(hit => ({
          timestamp: hit.fields.milestones_timestamp[0],
          text: hit._source[visParams.labelField],
          ...(visParams.categoryField !== undefined && visParams.category !== '--- None selected ---') ? { category: hit._source[visParams.categoryField] } : {},
        })),
      };
    }
  };
}
