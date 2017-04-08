// index.js - elasticsearch
const elasticsearch = require('elasticsearch');
const fs = require('fs');

// create elasticsearch connection
exports.esClient = new elasticsearch.Client({
  host: '127.0.0.1:9200',
  log: 'error',
});

// index JSON data
exports.bulkIndex = function bulkIndex(index, type, data) {
  const bulkBody = [];

  data.forEach(item => {
    bulkBody.push({
      index: {
        _index: index,
        _type: type,
        _id: item.id,
      },
    });

    bulkBody.push(item);
  });

  esClient.bulk({ body: bulkBody })
  .then((response) => {
    console.log('here');
    let errorCount = 0;
    response.items.forEach((item) => {
      if (item.index && item.index.error) {
        console.log(++errorCount, item.index.error);
      }
    });
    console.log(
      `Successfully indexed ${data.length - errorCount}
       out of ${data.length} items`
    );
  })
  .catch(console.err);
};

// index data from ./data.json
exports.indexData = function test() {
  const articles = JSON.parse(fs.readFileSync('data.json', 'utf8'));
  bulkIndex('library', 'article', articles);
};

// check indices
exports.indices = () => {
  return esClient.cat.indices({ v: true })
  .then(console.log)
  .catch(err => console.error(`Error connecting to the es client: ${err}`));
};

// search index
exports.search = function search(index, body) {
  return esClient.search({ index, body });
};

const test = function test() {
  const body = {
    size: 20,
    from: 0,
    query: {
      match: {
        title: {
          query: 'lorem ipsum dolor sit', // query string
          minimum_should_match: 3, // minimum number of words that should match in query
          fuzziness: 0, // number of closely spelled terms
        },
      },
    },
  };

  search('library', body)
  .then((results) => {
    console.log(`found ${results.hits.total} items in ${results.took}ms`);
    console.log('returned article titles:');
    results.hits.hits.forEach((hit, index) => console.log(
        `\t${body.from + ++index} - ${hit._source.title}`
      )
    )
  })
  .catch(console.error);
};
