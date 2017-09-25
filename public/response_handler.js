import _ from 'lodash';
// import { AggResponseIndexProvider } from 'ui/agg_response/index';

const MilestonesResponseHandlerProvider = function (Private) {
  // const aggResponse = Private(AggResponseIndexProvider);

  return {
    name: 'milestones',
    handler: function (vis, response) {
      return new Promise((resolve) => {
        if (!response) {
          resolve();
          return;
        }

        const histogramAggId = _.first(_.pluck(vis.aggs.bySchemaName.segment, 'id'));
        if (!histogramAggId || !response.aggregations) {
          resolve();
          return;
        }

        const categoryAggId = _.first(_.pluck(vis.aggs.bySchemaName.categories, 'id'));
        const titleAggId = _.first(_.pluck(vis.aggs.bySchemaName.milestone_title, 'id'));
        const interval = _.first(vis.aggs.bySchemaName.segment).buckets.getInterval().esUnit;

        if (typeof response.aggregations[histogramAggId] !== 'undefined') {
          const buckets = response.aggregations[histogramAggId].buckets;

          const events = buckets.reduce((p, bucket) => {
            bucket[titleAggId].buckets.map(title => {
              p.push({
                timestamp: bucket.key_as_string.split('.')[0],
                text: title.key
              });
            });
            return p;
          }, []);
          resolve({ data: events, interval });
          return;
        } else if (typeof response.aggregations[categoryAggId] !== 'undefined') {
          const buckets = response.aggregations[categoryAggId].buckets;
          const data = [];
          _.each(buckets, bucket => {
            if (typeof bucket[histogramAggId] !== 'undefined') {
              const events = bucket[histogramAggId].buckets.reduce((p, nestedBucket) => {
                nestedBucket[titleAggId].buckets.map(title => {
                  p.push({
                    timestamp: nestedBucket.key_as_string.split('.')[0],
                    text: title.key
                  });
                });
                return p;
              }, []);
              data.push({
                category: bucket.key,
                entries: events
              });
            }
          });
          resolve({ data, interval });
          return;
        }
      });
    }
  };
};

export { MilestonesResponseHandlerProvider };
