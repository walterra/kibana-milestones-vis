import { IRouter } from 'kibana/server';
import { registerServerSearchRoute } from './server_search_route';

export function registerRoutes(router: IRouter) {
  registerServerSearchRoute(router);
}
