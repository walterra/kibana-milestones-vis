import { buildExpression, buildExpressionFunction } from '../../../src/plugins/expressions/public';
import { Vis } from '../../../src/plugins/visualizations/public';
import { MilestonesExpressionFunctionDefinition, VisParams } from './milestones_fn';

export const toExpressionAst = (vis: Vis<VisParams>) => {
  const milestones = buildExpressionFunction<MilestonesExpressionFunctionDefinition>('milestones', {
    ...vis.params,
    indexPatternId: vis.data.indexPattern!.id!,
  });

  const ast = buildExpression([milestones]);

  return ast.toAst();
};
