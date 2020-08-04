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

import { i18n } from '@kbn/i18n';
// @ts-ignore
import { Status } from 'ui/vis/update_status';
import image from './images/icon-milestones.svg';

import { createMilestonesVisualization } from './milestones_visualization';
import { createMilestonesRequestHandler } from './milestones_request_handler';

import { visFactory } from '../../../src/legacy/core_plugins/visualizations/public';
import { MilestonesOptions } from './components/milestones_options';
import { NONE_SELECTED } from './constants';
import { MilestonesVisualizationDependencies } from './plugin';

export const createMilestonesTypeDefinition = (
  dependencies: MilestonesVisualizationDependencies
) => {
  const requestHandler = createMilestonesRequestHandler(dependencies);
  const visualization = createMilestonesVisualization();

  return visFactory.createBaseVisualization({
    name: 'kibana_milestones_vis',
    title: i18n.translate('milestones.vis.milestonesTitle', { defaultMessage: 'Milestones' }),
    image,
    description: i18n.translate('milestones.vis.milestonesDescription', {
      defaultMessage: 'A timeline of events with labels.',
    }),
    visConfig: {
      defaults: {
        categoryField: NONE_SELECTED,
        labelField: NONE_SELECTED,
        distribution: 'top-bottom',
        interval: 'minute',
        maxDocuments: 10,
        showLabels: true,
      },
    },
    requiresUpdateStatus: [Status.PARAMS, Status.DATA],
    requestHandler,
    responseHandler: 'none',
    visualization,
    editorConfig: {
      collections: {
        distributions: ['top-bottom', 'top', 'bottom'],
        intervals: ['second', 'minute', 'hour', 'day', 'week', 'month', 'quarter', 'year'],
      },
      optionsTemplate: MilestonesOptions,
      schemas: [],
    },
  });
};
