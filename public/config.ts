import { NONE_SELECTED, SCORE_FIELD } from '../common';

export const milestonesVisConfigDefaults = {
  categoryField: NONE_SELECTED,
  labelField: NONE_SELECTED,
  distribution: 'top-bottom',
  aggregateBy: 'minute',
  maxDocuments: 10,
  orientation: 'horizontal',
  useLabels: true,
  sortField: SCORE_FIELD,
  sortOrder: 'desc',
} as const;

export const milestonesVisConfigOptions = {
  aggregateBy: ['second', 'minute', 'hour', 'day', 'week', 'month', 'quarter', 'year'],
  distribution: ['top-bottom', 'top', 'bottom'],
  orientation: ['horizontal', 'vertical'],
  sortOrder: ['asc', 'desc'],
} as const;
