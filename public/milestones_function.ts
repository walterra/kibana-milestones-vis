import { get } from 'lodash';
import { i18n } from '@kbn/i18n';
import type { ExecutionContextSearch } from '../../../src/plugins/data/public';
import type { Adapters } from '../../../src/plugins/inspector/common';
import type {
  ExecutionContext,
  ExpressionFunctionDefinition,
  Render,
} from '../../../src/plugins/expressions/public';
import type { MilestonesVisualizationDependencies } from './plugin';
import { createMilestonesRequestHandler } from './milestones_request_handler';
import type { KibanaContext, TimeRange, Query } from '../../../src/plugins/data/public';

import { EXPRESSION_NAME } from './constants';
import type { RawVisData } from './milestones_visualization';
import type { MilestonesVisParams } from './types';

type Input = KibanaContext | { type: 'null' };
type Output = Promise<Render<MilestonesRenderValue>>;

export type VisParams = Required<MilestonesVisParams>;

export interface MilestonesRenderValue {
  visData: RawVisData;
  visType: typeof EXPRESSION_NAME;
  visParams: VisParams;
}

export type MilestonesExpressionFunctionDefinition = ExpressionFunctionDefinition<
  typeof EXPRESSION_NAME,
  Input,
  MilestonesVisParams,
  Output,
  ExecutionContext<Adapters, ExecutionContextSearch>
>;

export const createMilestonesFn = (
  dependencies: MilestonesVisualizationDependencies
): MilestonesExpressionFunctionDefinition => ({
  name: EXPRESSION_NAME,
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
    aggregateBy: {
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
    useLabels: {
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
      as: EXPRESSION_NAME,
      value: {
        visData: response,
        visType: EXPRESSION_NAME,
        visParams: args,
      },
    };
  },
});
