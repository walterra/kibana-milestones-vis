import { buildExpression, buildExpressionFunction } from '../../../src/plugins/expressions/public';
import { Vis } from '../../../src/plugins/visualizations/public';
import { EXPRESSION_NAME } from './constants';
import type { MilestonesExpressionFunctionDefinition, VisParams } from './milestones_function';

export const toExpressionAst = (vis: Vis<VisParams>) => {
  const milestones = buildExpressionFunction<MilestonesExpressionFunctionDefinition>(
    EXPRESSION_NAME,
    {
      ...vis.params,
      indexPatternId: vis.data.indexPattern!.id!,
    }
  );

  const ast = buildExpression([milestones]);

  return ast.toAst();
};
