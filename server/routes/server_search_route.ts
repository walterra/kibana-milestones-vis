import { get } from 'lodash';

import { schema } from '@kbn/config-schema';

import type { DataRequestHandlerContext, IEsSearchRequest } from 'src/plugins/data/server';
import type { IEsSearchResponse } from 'src/plugins/data/common';

import type { IRouter } from '../../../../src/core/server';

import { NONE_SELECTED, SERVER_SEARCH_ROUTE_PATH } from '../../common';

export function defineServerSearchRoute(router: IRouter<DataRequestHandlerContext>) {
  router.post(
    {
      path: SERVER_SEARCH_ROUTE_PATH,
      validate: {
        body: schema.object({
          categoryField: schema.maybe(schema.string()),
          filtersDsl: schema.any(),
          index: schema.string(),
          labelField: schema.string(),
          maxDocuments: schema.number(),
          sortField: schema.string(),
          sortOrder: schema.string(),
          timeFieldName: schema.string(),
          timeRangeFrom: schema.oneOf([schema.number(), schema.string()]),
          timeRangeTo: schema.oneOf([schema.number(), schema.string()]),
        }),
      },
    },
    async (context, request, response) => {
      const {
        categoryField,
        filtersDsl,
        index,
        labelField,
        maxDocuments,
        sortField,
        sortOrder,
        timeFieldName,
        timeRangeFrom,
        timeRangeTo,
      } = request.body;

      const params = {
        index,
        body: {
          query: {
            bool: {
              must: [
                filtersDsl,
                {
                  range: {
                    [timeFieldName]: {
                      gte: timeRangeFrom,
                      lt: timeRangeTo,
                    },
                  },
                },
              ],
            },
          },
          _source: [
            labelField,
            ...(categoryField !== undefined && categoryField !== NONE_SELECTED
              ? [categoryField]
              : []),
          ],
          script_fields: {
            milestones_timestamp: {
              script: {
                source: `doc["${timeFieldName}"].value.millis`,
              },
            },
          },
          size: maxDocuments,
          sort: [{ [sortField]: { order: sortOrder } }],
        },
        waitForCompletionTimeout: '5m',
        keepAlive: '5m',
      };

      const res = await context.search!.search({ params } as IEsSearchRequest, {}).toPromise();

      return response.ok({
        body: {
          timeFieldName: timeFieldName,
          data: (res as IEsSearchResponse).rawResponse.hits.hits.map((hit: any) => ({
            timestamp: hit.fields.milestones_timestamp[0],
            text: get(hit._source, labelField),
            ...(categoryField !== undefined && categoryField !== NONE_SELECTED
              ? { category: get(hit._source, categoryField) }
              : {}),
          })),
        },
      });
    }
  );
}
