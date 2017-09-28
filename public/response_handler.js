import _ from 'lodash';

function timeFormat(timestamp) {
  const tzoffset = (new Date(timestamp)).getTimezoneOffset() * 60000; //offset in milliseconds
  const localISOTime = (new Date(timestamp - tzoffset)).toISOString().slice(0,-1);
  // e.g. '2015-01-26T06:40:36.181'
  return localISOTime;
}

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
                  timestamp: timeFormat(bucket.key),
                  text: label.key
                });
              });
            } else {
              p.push({
                timestamp: timeFormat(bucket.key),
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
                      timestamp: timeFormat(nestedBucket.key),
                      text: label.key
                    });
                  });
                } else {
                  p.push({
                    timestamp: timeFormat(nestedBucket.key),
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
