import './milestones_vis_params';
import { i18n } from '@kbn/i18n';
import { VisFactoryProvider } from 'ui/vis/vis_factory';
import { Schemas } from 'ui/vis/editors/default/schemas';
import { VisTypesRegistryProvider } from 'ui/registry/vis_types';
import image from './images/icon-milestones.svg';
import { Status } from 'ui/vis/update_status';

import MilestonesVisualization from './milestones_visualization';
import { MilestonesVisRequestHandlerProvider } from './milestones_vis_request_handler'

VisTypesRegistryProvider.register(function (Private) {
  const VisFactory = Private(VisFactoryProvider);
  const milestonesVisRequestHandler = Private(MilestonesVisRequestHandlerProvider).handler;

  return VisFactory.createBaseVisualization({
    name: 'kibana_milestones_vis',
    title: i18n.translate('milestones.vis.milestonesTitle', { defaultMessage: 'Milestones' }),
    image,
    description: i18n.translate('milestones.vis.milestonesDescription', {
      defaultMessage: 'A timeline of events with labels.'
    }),
    visConfig: {
      defaults: {
        categoryField: undefined,
        distribution: 'top-bottom',
        interval: 'minute',
        labelField: undefined,
        maxDocuments: 10,
        showLabels: true,
      }
    },
    requiresUpdateStatus: [Status.PARAMS, Status.RESIZE, Status.DATA],
    requestHandler: milestonesVisRequestHandler,
    responseHandler: 'none',
    visualization: MilestonesVisualization,
    editorConfig: {
      collections: {
        distributions: ['top-bottom', 'top', 'bottom'],
        categoryFields: [],
        interval: [
          'second',
          'minute',
          'hour',
          'day',
          'week',
          'month',
          'quarter',
          'year',
        ],
        labelFields: [],
      },
      optionsTemplate: '<milestones-vis-params />',
      schemas: new Schemas([])
    }
  });
});
