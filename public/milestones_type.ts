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
