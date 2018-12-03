function timeFormat(timestamp) {
  const tzoffset = (new Date(timestamp)).getTimezoneOffset() * 60000; //offset in milliseconds
  const localISOTime = (new Date(timestamp - tzoffset)).toISOString().slice(0, -1);
  // e.g. '2015-01-26T06:40:36.181'
  return localISOTime;
}

function getColumnIdBySchemaName(columns, schemaName) {
  const column = columns.find((c) => {
    return c.aggConfig.__schema.name === schemaName;
  });
  return column && column.id || undefined;
}

const milestonesResponseHandlerProvider = function () {
  return {
    name: 'milestones',
    handler: (response) => {
      return new Promise((resolve) => {
        if (!response || !response.columns) {
          resolve();
          return;
        }

        const histogramAggId = getColumnIdBySchemaName(response.columns, 'segment');
        if (!histogramAggId || !response.rows) {
          resolve();
          return;
        }

        const splitAggId = getColumnIdBySchemaName(response.columns, 'milestone_split');
        const labelsAggId = getColumnIdBySchemaName(response.columns, 'milestone_labels');

        const histogramColumn = response.columns.find(c => c.id === histogramAggId);
        const interval = histogramColumn.aggConfig.buckets.getInterval().esUnit;

        const data = response.rows.map((row) => {
          const entry = {
            timestamp: timeFormat(row[histogramAggId]),
            text: row[labelsAggId]
          };

          if (typeof row[splitAggId] !== 'undefined') {
            entry.category = row[splitAggId];
          }

          return entry;
        });

        resolve({ data, interval });
      });
    }
  };
};

export { milestonesResponseHandlerProvider };
