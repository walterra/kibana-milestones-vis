import { i18n } from '@kbn/i18n';
// @ts-ignore
import image from './images/icon-milestones.svg';
import { Status } from 'ui/vis/update_status';

import { createMilestonesVisualization } from './milestones_visualization';
import { createMilestonesRequestHandler } from './milestones_request_handler'

import { visFactory } from '../../../src/legacy/core_plugins/visualizations/public';
import { MilestonesOptions } from './components/milestones_options';
import { NONE_SELECTED } from './constants';
import { MilestonesVisualizationDependencies } from './plugin';

export const createMilestonesTypeDefinition = (dependencies: MilestonesVisualizationDependencies) => {
  const requestHandler = createMilestonesRequestHandler(dependencies);
  const visualization = createMilestonesVisualization();

  return visFactory.createBaseVisualization({
    name: 'kibana_milestones_vis',
    title: i18n.translate('milestones.vis.milestonesTitle', { defaultMessage: 'Milestones' }),
    image,
    description: i18n.translate('milestones.vis.milestonesDescription', {
      defaultMessage: 'A timeline of events with labels.'
    }),
    visConfig: {
      defaults: {
        categoryField: NONE_SELECTED,
        labelField: NONE_SELECTED,
        distribution: 'top-bottom',
        interval: 'minute',
        maxDocuments: 10,
        showLabels: true,
      }
    },
    requiresUpdateStatus: [Status.PARAMS, Status.DATA],
    requestHandler,
    responseHandler: 'none',
    visualization,
    editorConfig: {
      collections: {
        distributions: ['top-bottom', 'top', 'bottom'],
        intervals: [
          'second',
          'minute',
          'hour',
          'day',
          'week',
          'month',
          'quarter',
          'year',
        ],
      },
      optionsTemplate: MilestonesOptions,
      schemas: []
    }
  });
};
