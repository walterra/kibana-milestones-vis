const { Client } = require('@elastic/elasticsearch');
const client = new Client({ node: 'http://localhost:9200' });
const dataCovid19 = require('../node_modules/d3-milestones/src/stories/assets/covid19.json');
const dataLotr = require('../node_modules/d3-milestones/src/stories/assets/lotr.json');
const dataMilestonesEvents = require('../node_modules/d3-milestones/src/stories/assets/milestones-events.json');
const dataMilestones = require('../node_modules/d3-milestones/src/stories/assets/milestones.json');
const dataOsCategoryLabels = require('../node_modules/d3-milestones/src/stories/assets/os-category-labels.json');
const dataUltimaSeries = require('../node_modules/d3-milestones/src/stories/assets/ultima-series.json');
const dataVikings = require('../node_modules/d3-milestones/src/stories/assets/vikings.json');

const datasets = [
  {
    index: 'kmv-covid-19',
    mappings: {
      properties: {
        date: { type: 'date' },
        title: { type: 'text' },
      },
    },
    data: dataCovid19,
  },
  {
    index: 'kmv-lotr',
    mappings: {
      properties: {
        timestamp: { type: 'date', format: 'dd.MM.yyyy||strict_date_optional_time ||epoch_millis' },
        character: { type: 'keyword' },
        text: { type: 'text' },
      },
    },
    data: dataLotr,
  },
  {
    index: 'kmv-milestones',
    mappings: {
      properties: {
        timestamp: {
          type: 'date',
          format: `yyyy.MM.dd'T'HH:mm||strict_date_optional_time ||epoch_millis`,
        },
        detail: { type: 'keyword' },
        giturl: { type: 'keyword' },
      },
    },
    data: dataMilestones,
  },
  {
    index: 'kmv-milestones-events',
    mappings: {
      properties: {
        timestamp: {
          type: 'date',
          format: `yyyy.MM.dd'T'HH:mm||strict_date_optional_time ||epoch_millis`,
        },
        detail: { type: 'keyword' },
      },
    },
    data: dataMilestonesEvents,
  },
  {
    index: 'kmv-os-category-labels',
    mappings: {
      properties: {
        year: {
          type: 'date',
          format: 'yyyy||strict_date_optional_time ||epoch_millis',
        },
        title: { type: 'keyword' },
        system: { type: 'keyword' },
      },
    },
    data: dataOsCategoryLabels,
    transform: (data) => {
      return data.reduce((p, c) => {
        c.versions.forEach((version) => {
          p.push({
            ...version,
            system: c.system,
          });
        });
        return p;
      }, []);
    },
  },
  {
    index: 'kmv-ultima-series',
    mappings: {
      properties: {
        year: {
          type: 'date',
          format: 'yyyy||strict_date_optional_time ||epoch_millis',
        },
        cover: { type: 'keyword' },
        title: { type: 'keyword' },
      },
    },
    data: dataUltimaSeries,
  },
  {
    index: 'kmv-vikings',
    mappings: {
      properties: {
        year: {
          type: 'date',
          format: 'yyyy||strict_date_optional_time ||epoch_millis',
        },
        title: { type: 'text' },
      },
    },
    data: dataVikings,
    transform: (data) => {
      return data.map((d) => ({
        ...d,
        year: `${d.year}`.padStart(4, '0'),
      }));
    },
  },
];

async function run({ index, mappings, data, transform }) {
  const indexExists = await client.indices.exists({ index });

  if (indexExists.body === true) {
    await client.indices.delete({ index });
  }

  await client.indices.create(
    {
      index,
      body: {
        mappings,
      },
    },
    { ignore: [400] }
  );

  const transformedData = transform !== undefined ? transform(data) : data;

  const body = transformedData.flatMap((doc) => [{ index: { _index: index } }, doc]);

  const { body: bulkResponse } = await client.bulk({ refresh: true, body });

  if (bulkResponse.errors) {
    const erroredDocuments = [];
    // The items array has the same order of the dataset we just indexed.
    // The presence of the `error` key indicates that the operation
    // that we did for the document has failed.
    bulkResponse.items.forEach((action, i) => {
      const operation = Object.keys(action)[0];
      if (action[operation].error) {
        erroredDocuments.push({
          // If the status is 429 it means that you can retry the document,
          // otherwise it's very likely a mapping error, and you should
          // fix the document before to try it again.
          status: action[operation].status,
          error: action[operation].error,
          operation: body[i * 2],
          document: body[i * 2 + 1],
        });
      }
    });
    console.log(erroredDocuments);
  }

  const { body: count } = await client.count({ index });
  console.log(count);
}

datasets.forEach((dataset) => {
  run(dataset).catch(console.log);
});
