import React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import { i18n } from '@kbn/i18n';

import type { ExpressionRenderDefinition } from '../../../src/plugins/expressions';

import { MilestonesRenderValue } from './milestones_function';

import { MilestonesVisualization } from './milestones_visualization';

export const getMilestonesVisRenderer = (): ExpressionRenderDefinition<MilestonesRenderValue> => ({
  name: 'kibana_milestones_vis',
  displayName: i18n.translate('milestones.vis.visualizationName', {
    defaultMessage: 'Milestones',
  }),
  help: '',
  validate: () => undefined,
  reuseDomNode: true,
  render: async (domNode, config, handlers) => {
    handlers.onDestroy(() => {
      unmountComponentAtNode(domNode);
    });

    render(<MilestonesVisualization {...config} />, domNode, () => {
      handlers.done();
    });
  },
});
