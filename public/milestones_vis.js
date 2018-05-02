import './milestones.less';
import './milestones_vis_params';
import { VisFactoryProvider } from 'ui/vis/vis_factory';
import { CATEGORY } from 'ui/vis/vis_category';
import { Schemas } from 'ui/vis/editors/default/schemas';
import { VisTypesRegistryProvider } from 'ui/registry/vis_types';
import image from './images/icon-milestones.svg';

import Milestones from './milestones';
import { MilestonesResponseHandlerProvider } from './response_handler';

function MilestonesProvider(Private) {
  const VisFactory = Private(VisFactoryProvider);
  const responseHandler = MilestonesResponseHandlerProvider().handler;

  return VisFactory.createBaseVisualization({
    name: 'milestones',
    title: 'Milestones',
    image,
    description: 'A timeline of events with labels.',
    category: CATEGORY.TIME,
    visualization: Milestones,
    visConfig: {
      defaults: {
        layout: {
          showLabels: true,
          distribution: 'top-bottom'
        }
      }
    },
    responseHandler: responseHandler,
    editorConfig: {
      optionsTemplate: '<milestones-vis-params></milestones-vis-params>',
      schemas: new Schemas([
        {
          group: 'buckets',
          name: 'segment',
          title: 'X-Axis',
          min: 0,
          max: 1,
          aggFilter: 'date_histogram',
          defaults: [
            { schema: 'segment', type: 'date_histogram' }
          ]
        },
        {
          group: 'buckets',
          name: 'milestone_labels',
          title: 'Milestone Labels',
          min: 0,
          max: 1,
          aggFilter: 'terms',
          defaults: [
            { type: 'terms', schema: 'milestone_labels', params: { field: '_index' } }
          ]
        },
        {
          group: 'buckets',
          name: 'milestone_split',
          title: 'Split Chart',
          min: 0,
          max: 1,
          aggFilter: 'terms'
        }
      ])
    },
    hierarchicalData: true
  });
}

// register the provider with the visTypes registry
VisTypesRegistryProvider.register(MilestonesProvider);

// export the provider so that the visType can be required with Private()
export default MilestonesProvider;
