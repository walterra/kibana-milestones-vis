/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

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
