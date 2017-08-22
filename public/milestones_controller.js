import _ from 'lodash';
import { uiModules } from 'ui/modules';
import Milestones from './milestones';
import AggConfigResult from 'ui/vis/agg_config_result';
import { FilterBarClickHandlerProvider } from 'ui/filter_bar/filter_bar_click_handler';

const module = uiModules.get('kibana/milestones', ['kibana']);
module.controller('KbnMilestonesController', function ($scope, $element, Private, getAppState) {

  const containerNode = $element[0];
  const filterBarClickHandler = Private(FilterBarClickHandlerProvider);
  const truncated = false;

  const milestones = new Milestones(containerNode);
  milestones.on('select', (event) => {
    const appState = getAppState();
    const clickHandler = filterBarClickHandler(appState);
    const aggs = $scope.vis.aggs.getResponseAggs();
    const aggConfigResult = new AggConfigResult(aggs[0], false, event, event);
    clickHandler({ point: { aggConfigResult: aggConfigResult } });
  });

  milestones.on('renderComplete', () => {
    const truncatedMessage = containerNode.querySelector('.milestones-truncated-message');
    const incompleteMessage = containerNode.querySelector('.milestones-incomplete-message');

    if (!$scope.vis.aggs[0] || !$scope.vis.aggs[1]) {
      incompleteMessage.style.display = 'none';
      truncatedMessage.style.display = 'none';
      return;
    }

    const bucketName = containerNode.querySelector('.milestones-custom-label');
    bucketName.innerHTML = `${$scope.vis.aggs[0].makeLabel()} - ${$scope.vis.aggs[1].makeLabel()}`;
    truncatedMessage.style.display = truncated ? 'block' : 'none';

    const status = milestones.getStatus();
    if (Milestones.STATUS.COMPLETE === status) {
      incompleteMessage.style.display = 'none';
    } else if (Milestones.STATUS.INCOMPLETE === status) {
      incompleteMessage.style.display = 'block';
    }

    $scope.renderComplete();
  });

  $scope.$watch('esResponse', async function (response) {
    if (!response) {
      milestones.setData([]);
      return;
    }

    const AggId = _.first(_.pluck($scope.vis.aggs.bySchemaName.segment, 'id'));
    if (!AggId || !response.aggregations) {
      milestones.setData([]);
      return;
    }

    const categoryAggId = _.first(_.pluck($scope.vis.aggs.bySchemaName.categories, 'id'));
    const hitsAggId = _.first(_.pluck($scope.vis.aggs.bySchemaName.top_hits, 'id'));

    if (typeof response.aggregations[AggId] !== 'undefined') {
      const buckets = response.aggregations[AggId].buckets;

      const events = buckets.reduce((p, bucket) => {
        bucket[hitsAggId].hits.hits.map(hit => {
          p.push({
            timestamp: bucket.key_as_string.split('.')[0],
            text: hit.sort[0]
          });
        });
        return p;
      }, []);
      milestones.setData(events);
    } else if (typeof response.aggregations[categoryAggId] !== 'undefined') {
      const buckets = response.aggregations[categoryAggId].buckets;
      const data = [];
      _.each(buckets, bucket => {
        if (typeof bucket[AggId] !== 'undefined') {
          const events = bucket[AggId].buckets.reduce((p, nestedBucket) => {
            nestedBucket[hitsAggId].hits.hits.map(hit => {
              p.push({
                timestamp: nestedBucket.key_as_string.split('.')[0],
                text: hit.sort[0]
              });
            });
            return p;
          }, []);
          data.push(events);
        }
      });
      if (data.length > 0) {
        milestones.setData(data);
      }
    }
  });


  $scope.$watch('vis.params', (options) => milestones.setOptions(options));

  $scope.$watch('resize', () => {
    milestones.resize();
  });
});
