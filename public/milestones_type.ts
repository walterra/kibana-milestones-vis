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

import { milestonesVisConfigDefaults, milestonesVisConfigOptions } from './config';
import { toExpressionAst } from './to_ast';
import { MilestonesOptions } from './components/milestones_options';
import { MilestonesVisParams } from './types';

const mapOptionToCollection = <T = string[]>(d: T) => ({ text: d, value: d });

export const createMilestonesTypeDefinition = (): VisTypeDefinition<MilestonesVisParams> => ({
  name: 'kibana_milestones_vis',
  title: 'Milestones',
  icon: 'visTagCloud',
  group: VisGroups.PROMOTED,
  description: i18n.translate('milestones.vis.milestonesDescription', {
    defaultMessage: 'A timeline of events with labels.',
  }),
  visConfig: {
    defaults: milestonesVisConfigDefaults,
  },
  editorConfig: {
    optionsTemplate: MilestonesOptions,
    enableAutoApply: true,
    defaultSize: DefaultEditorSize.MEDIUM,
    collections: {
      distributions: milestonesVisConfigOptions.distribution.map(mapOptionToCollection),
      aggregateBy: milestonesVisConfigOptions.aggregateBy.map(mapOptionToCollection),
      orientation: milestonesVisConfigOptions.orientation.map(mapOptionToCollection),
      sortOrder: milestonesVisConfigOptions.sortOrder.map(mapOptionToCollection),
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
