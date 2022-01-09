/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

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
