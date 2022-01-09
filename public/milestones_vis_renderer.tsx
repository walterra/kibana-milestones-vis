import React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import { ExpressionRenderDefinition } from '../../../src/plugins/expressions';

import { MilestonesRenderValue } from './milestones_fn';

import { MilestonesVisualization } from './milestones_visualization';

export const getMilestonesVisRenderer: () => ExpressionRenderDefinition<MilestonesRenderValue> = () => ({
  name: 'milestones_vis',
  reuseDomNode: true,
  render: async (domNode, config, handlers) => {
    handlers.onDestroy(() => {
      unmountComponentAtNode(domNode);
    });

    render(<MilestonesVisualization renderComplete={handlers.done} {...config} />, domNode);
  },
});
