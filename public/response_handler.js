import _ from 'lodash';

const MilestonesResponseHandlerProvider = function () {
  return {
    name: 'milestones',
    handler: (vis, response) => {
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

        const splitAggId = _.first(_.pluck(vis.aggs.bySchemaName.milestone_split, 'id'));
        const labelsAggId = _.first(_.pluck(vis.aggs.bySchemaName.milestone_labels, 'id'));
        const interval = _.first(vis.aggs.bySchemaName.segment).buckets.getInterval().esUnit;

        let data;
        if (typeof response.aggregations[histogramAggId] !== 'undefined') {
          const buckets = response.aggregations[histogramAggId].buckets;

          data = buckets.reduce((p, bucket) => {
            if (typeof bucket[labelsAggId] !== 'undefined') {
              bucket[labelsAggId].buckets.map(label => {
                p.push({
                  timestamp: bucket.key_as_string.split('.')[0],
                  text: label.key
                });
              });
            } else {
              p.push({
                timestamp: bucket.key_as_string.split('.')[0],
                text: bucket.key_as_string.split('.')[0]
              });
            }
            return p;
          }, []);
          resolve({ data, interval });
          return;
        } else if (typeof response.aggregations[splitAggId] !== 'undefined') {
          const buckets = response.aggregations[splitAggId].buckets;
          data = [];
          _.each(buckets, bucket => {
            if (typeof bucket[histogramAggId] !== 'undefined') {
              const events = bucket[histogramAggId].buckets.reduce((p, nestedBucket) => {
                if (typeof nestedBucket[labelsAggId] !== 'undefined') {
                  nestedBucket[labelsAggId].buckets.map(label => {
                    p.push({
                      timestamp: nestedBucket.key_as_string.split('.')[0],
                      text: label.key
                    });
                  });
                } else {
                  p.push({
                    timestamp: nestedBucket.key_as_string.split('.')[0],
                    text: nestedBucket.key_as_string.split('.')[0]
                  });
                }
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
