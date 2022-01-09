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

import { DefaultEditorSize } from '../../../src/plugins/vis_default_editor/public';
import {
  VIS_EVENT_TO_TRIGGER,
  VisGroups,
  VisTypeDefinition,
} from '../../../src/plugins/visualizations/public';

import { NONE_SELECTED, SCORE_FIELD } from '../common';

import { toExpressionAst } from './to_ast';
import { MilestonesOptions } from './components/milestones_options';
import { MilestonesVisParams } from './types';

export const createMilestonesTypeDefinition = (): VisTypeDefinition<MilestonesVisParams> => ({
  name: 'kibana_milestones_vis',
  title: 'Milestones',
  icon: 'visTagCloud',
  group: VisGroups.PROMOTED,
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
      orientation: 'horizontal',
      showLabels: true,
      sortField: SCORE_FIELD,
      sortOrder: 'desc',
    },
  },
  editorConfig: {
    optionsTemplate: MilestonesOptions,
    enableAutoApply: true,
    defaultSize: DefaultEditorSize.MEDIUM,
    collections: {
      distributions: [
        { text: 'top-bottom', value: 'top-bottom' },
        { text: 'top', value: 'top' },
        { text: 'bottom', value: 'bottom' },
      ],
      intervals: [
        { text: 'second', value: 'second' },
        { text: 'minute', value: 'minute' },
        { text: 'hour', value: 'hour' },
        { text: 'day', value: 'day' },
        { text: 'week', value: 'week' },
        { text: 'month', value: 'month' },
        { text: 'quarter', value: 'quarter' },
        { text: 'year', value: 'year' },
      ],
      orientation: [
        { text: 'horizontal', value: 'horizontal' },
        { text: 'vertical', value: 'vertical' },
      ],
      sortOrder: [
        { text: 'asc', value: 'asc' },
        { text: 'desc', value: 'desc' },
      ],
    },
  },
  toExpressionAst,
  options: {
    showIndexSelection: true,
    showQueryBar: true,
    showFilterBar: true,
  },
  getSupportedTriggers: () => {
    return [VIS_EVENT_TO_TRIGGER.applyFilter];
  },
  requiresSearch: true,
});
