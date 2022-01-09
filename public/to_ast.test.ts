/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

import type { Vis } from '../../../src/plugins/visualizations/public';
import { toExpressionAst } from './to_ast';
import { MilestonesVisParams } from './types';

describe('milestones vis toExpressionAst function', () => {
  let vis: Vis<MilestonesVisParams>;

  beforeEach(() => {
    vis = {
      isHierarchical: () => false,
      type: {},
      params: {},
      data: {
        indexPattern: { id: '123' },
        aggs: {
          getResponseAggs: () => [],
          aggs: [],
        },
      },
    } as any;
  });

  it('should match snapshot without params', () => {
    const actual = toExpressionAst(vis);
    expect(actual).toMatchSnapshot();
  });

  it('should match snapshot params fulfilled', () => {
    // set non-default values
    vis.params = {
      indexPatternId: 'the-index-pattern-id',
      distribution: 'top',
      categoryField: 'the-category-field',
      interval: 'year',
      labelField: 'the-label-field',
      maxDocuments: 100,
      orientation: 'vertical',
      showLabels: false,
      sortField: 'the-sort-field',
      sortOrder: 'desc',
    };
    const actual = toExpressionAst(vis);
    expect(actual).toMatchSnapshot();
  });
});
