import './milestones.less';
import { VisFactoryProvider } from 'ui/vis/vis_factory';
import { CATEGORY } from 'ui/vis/vis_category';
import { VisSchemasProvider } from 'ui/vis/editors/default/schemas';
import { VisTypesRegistryProvider } from 'ui/registry/vis_types';
import image from './images/icon-milestones.svg';

import Milestones from './milestones';
import { MilestonesResponseHandlerProvider } from './response_handler';

function MilestonesProvider(Private) {
  const VisFactory = Private(VisFactoryProvider);
  const Schemas = Private(VisSchemasProvider);
  const responseHandler = Private(MilestonesResponseHandlerProvider).handler;

  return VisFactory.createBaseVisualization({
    name: 'milestones',
    title: 'Milestones',
    image,
    description: 'A timeline of events with labels.',
    category: CATEGORY.TIME,
    visualization: Milestones,
    visConfig: {
      defaults: {}
    },
    responseHandler: responseHandler,
    editorConfig: {
      collections: {},
      schemas: new Schemas([
        {
          group: 'metrics',
          name: 'milestone_title',
          title: 'Milestone Title',
          min: 1,
          max: 1,
          aggFilter: ['terms'],
          defaults: [
            {
              schema: 'milestone_title',
              type: 'terms',
              params: {
                size: 3,
                order: 'asc',
                orderBy: '_term'
              }
            }
          ]
        },
        {
          group: 'buckets',
          name: 'segment',
          title: 'X-Axis',
          min: 1,
          max: 1,
          aggFilter: 'date_histogram',
          defaults: [
            { schema: 'segment', type: 'date_histogram' }
          ]
        },
        {
          group: 'buckets',
          name: 'categories',
          title: 'Categories',
          min: 0,
          max: 1,
          aggFilter: ['terms']
        },
      ])
    },
    hierarchicalData: true
  });
}

// register the provider with the visTypes registry
VisTypesRegistryProvider.register(MilestonesProvider);

// export the provider so that the visType can be required with Private()
export default MilestonesProvider;
