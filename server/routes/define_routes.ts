import type { IRouter } from 'kibana/server';

import type { DataRequestHandlerContext } from 'src/plugins/data/server';

import { defineServerSearchRoute } from './server_search_route';

export function defineRoutes(router: IRouter<DataRequestHandlerContext>) {
  defineServerSearchRoute(router);
}
