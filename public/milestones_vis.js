import './milestones.less';
import './milestones_vis_params';
// eslint-disable-next-line import/no-unresolved
import { VisFactoryProvider } from 'ui/vis/vis_factory';
// eslint-disable-next-line import/no-unresolved
import { Schemas } from 'ui/vis/editors/default/schemas';
// eslint-disable-next-line import/no-unresolved
import { VisTypesRegistryProvider } from 'ui/registry/vis_types';
import image from './images/icon-milestones.svg';
// eslint-disable-next-line import/no-unresolved
import { Status } from 'ui/vis/update_status';

import Milestones from './milestones';
import { milestonesResponseHandlerProvider } from './response_handler';

function MilestonesProvider(Private) {
  const VisFactory = Private(VisFactoryProvider);
  const responseHandler = milestonesResponseHandlerProvider().handler;

  return VisFactory.createBaseVisualization({
    name: 'milestones',
    title: 'Milestones',
    image,
    description: 'A timeline of events with labels.',
    requiresUpdateStatus: [Status.PARAMS, Status.RESIZE, Status.DATA],
    visualization: Milestones,
    visConfig: {
      defaults: {
        layout: {
          cropTimerange: false,
          showLabels: true,
          distribution: 'top-bottom'
        }
      }
    },
    responseHandler: responseHandler,
    editorConfig: {
      collections: {
        distributions: ['top-bottom', 'top', 'bottom']
      },
      optionsTemplate: '<milestones-vis-params></milestones-vis-params>',
      schemas: new Schemas([
        {
          group: 'metrics',
          name: 'metric',
          title: 'Dummy Metric Aggregation',
          min: 1,
          max: 1,
          aggFilter: ['count'],
          defaults: [
            { schema: 'metric', type: 'count' }
          ]
        },
        {
          group: 'buckets',
          name: 'segment',
          title: 'X-Axis',
          min: 0,
          max: 1,
          aggFilter: ['date_histogram'],
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
          aggFilter: ['terms'],
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
          aggFilter: ['terms']
        }
      ])
    }
  });
}

// register the provider with the visTypes registry
VisTypesRegistryProvider.register(MilestonesProvider);
