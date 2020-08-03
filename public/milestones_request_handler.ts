// @ts-ignore
import { buildEsQuery, getEsQueryConfig } from '@kbn/es-query';

import { NONE_SELECTED } from './constants';
import { MilestonesVisualizationDependencies } from './plugin';

export function createMilestonesRequestHandler({ es, uiSettings }: MilestonesVisualizationDependencies) {
  return async (req: any) => {
      const { index, timeRange, filters, query, visParams } = req;
      const indexPatternTitle = index.title;
      const esQueryConfigs = getEsQueryConfig(uiSettings);
      const filtersDsl = buildEsQuery(undefined, query, filters, esQueryConfigs);

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
                      lt: timeRange.to
                    }
                  }
                }
              ]
            }
          },
          _source: [
            visParams.labelField,
            ...(visParams.categoryField !== undefined && visParams.categoryField !== NONE_SELECTED) ? [visParams.categoryField] : [],
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
        data: resp.hits.hits.map((hit: any) => ({
          timestamp: hit.fields.milestones_timestamp[0],
          text: hit._source[visParams.labelField],
          ...(visParams.categoryField !== undefined && visParams.category !== NONE_SELECTED) ? { category: hit._source[visParams.categoryField] } : {},
        })),
      };
  };
}
