// index.js - elasticsearch
const elasticsearch = require('elasticsearch');
const Promise = require('bluebird');
let db = require('./../db/index.js').connection;
const fs = require('fs');

db = Promise.promisifyAll(db, { multiArgs: true });

// create elasticsearch connection
const esClient = new elasticsearch.Client({
  host: '127.0.0.1:9200',
  log: 'error',
});

/* index json data
 * index is database name
 * type is table name
 * data is the data being indexed
 */
const bulkIndex = (index, type, data) => {
  const bulkbody = [];
  data.forEach((item) => {
    bulkbody.push({
      index: {
        _index: index,
        _type: type,
        _id: item.id,
      },
    });

    bulkbody.push(item);
  });

  return esClient.bulk({ body: bulkbody })
  .then((response) => {
    let errorcount = 0;
    response.items.forEach((item) => {
      if (item.index && item.index.error) {
        console.log('error from index', ++errorcount, item.index.error);
      }
    });
    console.log(
      `successfully indexed ${data.length - errorcount}
       out of ${data.length} items`
    );
  })
  .catch((error) => {
    console.error('error from index', error);
  });
};

// get all from database table
const getAllFromDatabaseTable = (table) => {
  return db.queryAsync(`select * from ${table}`);
};

// check indices of elasticsearch
const indices = () => {
  return esClient.cat.indices({ v: true })
  .then(console.log)
  .catch(err => console.error(`error connecting to the es client: ${err}`));
};

// search index
const search = (index, body) => {
  return esClient.search({ index, body });
};

// example function
const test = () => {
  const body = {
    size: 1,
    from: 0,
    query: {
      match: {
        email: {
          query: 'bwon', // query string
          minimum_should_match: 0, // minimum number of words that should match in query
          fuzziness: 0, // number of closely spelled terms
        },
      },
    },
  };

  search('stackedup', 'applicants', body)
  .then((results) => {
    console.log(`found ${results.hits.total} items in ${results.took}ms`);
    console.log('returned article titles:');
    results.hits.hits.forEach(item => console.log(item));
  })
  .catch(console.error);
};

// delete all indices of elasticsearch
const deleteIndices = () => {
  return esClient.indices.delete({ index: '_all' });
};

// index MySQL database for elasticsearch based on tables
const indexDatabase = () => {
  deleteIndices();
  const tables = ['applicants', 'employer', 'skills', 'job_postings'];
  tables.forEach((table) => {
    getAllFromDatabaseTable(table)
    .then((result) => {
      const data = result[0];
      if (data.length !== 0) {
        bulkIndex('stackedup', table, data);
      }
    });
  });
};


// module.exports = exports = main;
exports.bulkIndex = bulkIndex;
exports.deleteIndices = deleteIndices;
exports.indexDatabase = indexDatabase;
exports.search = search;
