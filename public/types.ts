import { Milestones } from 'react-milestones-vis';

type MilestonesProps = Pick<
  React.ComponentProps<typeof Milestones>,
  'distribution' | 'aggregateBy' | 'orientation' | 'useLabels'
>;

export interface MilestonesVisParams extends Required<MilestonesProps> {
  indexPatternId: string;
  categoryField: string;
  labelField: string;
  maxDocuments: number;
  sortField: string;
  sortOrder: 'asc' | 'desc';
}
