import { uiModules } from 'ui/modules';
import milestonesVisParamsTemplate from './milestones_vis_params.html';

uiModules.get('kibana/table_vis')
  .directive('milestonesVisParams', function () {
    return {
      restrict: 'E',
      template: milestonesVisParamsTemplate,
      link: function ($scope) {
        $scope.config = $scope.vis.type.editorConfig;
      }
    };
  });
