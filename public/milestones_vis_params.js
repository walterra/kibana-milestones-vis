// eslint-disable-next-line import/no-unresolved
import { uiModules } from 'ui/modules';
import milestonesVisParamsTemplate from './milestones_vis_params.html';

uiModules.get('kibana/table_vis')
  .directive('milestonesVisParams', function () {
    return {
      restrict: 'E',
      template: milestonesVisParamsTemplate,
      link: function ($scope) {
        $scope.config = $scope.vis.type.editorConfig;

        $scope.config.collections.labelFields = $scope.vis.indexPattern.fields
          .filter(field => field.type === 'string' && !['_id', '_index', '_type'].includes(field.name))
          .map(field => field.name);

        $scope.config.collections.categoryFields = [
          '--- None selected ---',
          ...$scope.config.collections.labelFields,
        ];

        if ($scope.vis.params.labelField === undefined) {
          $scope.vis.params.labelField = $scope.config.collections.labelFields[0];
        }

        if ($scope.vis.params.categoryField === undefined) {
          $scope.vis.params.categoryField = $scope.config.collections.categoryFields[0];
        }
      }
    };
  });
