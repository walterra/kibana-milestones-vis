/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

import { get } from 'lodash';
import { i18n } from '@kbn/i18n';
import { ExecutionContextSearch } from '../../../src/plugins/data/public';
import { Adapters } from '../../../src/plugins/inspector/common';
import {
  ExecutionContext,
  ExpressionFunctionDefinition,
  Render,
} from '../../../src/plugins/expressions/public';
import { MilestonesVisualizationDependencies } from './plugin';
import { createMilestonesRequestHandler } from './milestones_request_handler';
import { KibanaContext, TimeRange, Query } from '../../../src/plugins/data/public';

import { RawVisData } from './milestones_visualization';
import { MilestonesVisParams } from './types';

type Input = KibanaContext | { type: 'null' };
type Output = Promise<Render<MilestonesRenderValue>>;

export type VisParams = Required<MilestonesVisParams>;

export interface MilestonesRenderValue {
  visData: RawVisData;
  visType: 'milestones';
  visConfig: VisParams;
}

export type MilestonesExpressionFunctionDefinition = ExpressionFunctionDefinition<
  'milestones',
  Input,
  MilestonesVisParams,
  Output,
  ExecutionContext<Adapters, ExecutionContextSearch>
>;

// distribution: 'top-bottom' | 'top' | 'bottom';
// categoryField: string;
// interval: 'second' | 'minute' | 'hour' | 'day' | 'week' | 'month' | 'quarter' | 'year';
// labelField: string;
// maxDocuments: number;
// orientation: 'horizontal' | 'vertical';
// showLabels: boolean;
// sortField: string;
// sortOrder: 'asc' | 'desc';

// aggregateBy: 'minute',
// optimize: false,
// autoResize: true,
// orientation: 'horizontal',
// distribution: 'top-bottom',
// useLabels: true,
// data: [],

export const createMilestonesFn = (
  dependencies: MilestonesVisualizationDependencies
): MilestonesExpressionFunctionDefinition => ({
  name: 'milestones',
  type: 'render',
  inputTypes: ['kibana_context', 'null'],
  help: i18n.translate('visTypeMilestones.function.help', {
    defaultMessage: 'Milestones visualization',
  }),
  args: {
    indexPatternId: {
      types: ['string'],
      default: undefined,
      help: '',
    },
    distribution: {
      types: ['string'],
      default: 'top-bottom',
      help: '',
    },
    categoryField: {
      types: ['string'],
      default: undefined,
      help: '',
    },
    interval: {
      types: ['string'],
      default: 'minute',
      help: '',
    },
    labelField: {
      types: ['string'],
      default: undefined,
      help: '',
    },
    maxDocuments: {
      types: ['number'],
      default: 10,
      help: '',
    },
    orientation: {
      types: ['string'],
      default: 'horizontal',
      help: '',
    },
    showLabels: {
      types: ['boolean'],
      default: true,
      help: '',
    },
    sortField: {
      types: ['string'],
      default: undefined,
      help: '',
    },
    sortOrder: {
      types: ['string'],
      default: undefined,
      help: '',
    },
  },
  async fn(input, args) {
    const milestonesRequestHandler = createMilestonesRequestHandler(dependencies);

    const response = await milestonesRequestHandler({
      timeRange: get(input, 'timeRange') as TimeRange,
      query: get(input, 'query') as Query,
      filters: get(input, 'filters') as any,
      visParams: args,
    });

    return {
      type: 'render',
      as: 'milestones_vis',
      value: {
        visData: response,
        visType: 'milestones',
        visConfig: args,
      },
    };
  },
});
