const elasticsearch = require('elasticsearch');
const mysql = require('mysql');
const Promise = require('bluebird');
const fs = require('fs');
var db = require('../db/index.js').connection
const dbName = require('../db/index.js').dbName


// create elasticsearch connection
const esClient = new elasticsearch.Client(process.env.BONSAI_URL ||
{
  host: '127.0.0.1:9200',
  log: 'error',
});

// check indices of elasticsearch
const indices = () => {
  return esClient.cat.indices({ v: true })
  .then(console.log)
  .catch(err => console.error(`error connecting to the es client: ${err}`));
};

/* index json data
 * index is database name
 * type is table name
 * data is the data being indexed
 */
const bulkIndex = (index, type, data) => {
  const bulkbody = [];
  data.forEach((item, counter) => {
    bulkbody.push({
      index: {
        _index: index,
        _type: type,
        _id: counter,
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
    console.error('error from bulkIndex', error);
  });
};

const ESsearch = Promise.promisify(esClient.search);
// search index
const search = (index, body) => {
  return ESsearch({ index, body })
  .timeout(2000, message='\n\n\nElasticSearch FAIL // falling back to MYSQL Query')
  .catch((error)=>{
    var query;
    body && body.query.match._all.query ? query = body.query.match._all.query : null;
    return error?db.queryAsyncQuestion(
    `SELECT * FROM APPLICANTS WHERE USERNAME=?;`, query):null
  }); 
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

  search(dbName, 'applicants', body)
  .then((results) => {
    console.log(`found ${results.hits.total} items in ${results.took}ms`);
    console.log('returned article titles:');
    results.hits.hits.forEach(item => console.log(item));
  })
  .catch(console.error);
};

// get all from database table
const getAllFromDatabaseTables = () => {
  const queries = [
    'SELECT * FROM applicants',
    'SELECT * FROM employer',
    'SELECT job_postings.*, employer.company_name ' +
      'FROM job_postings ' +
      'INNER JOIN employer ON job_postings.employer_id = employer.id',
  ];

  return Promise.map(queries, query => db.queryAsync(query));
};

// delete all indices of elasticsearch
const deleteIndices = () => {
  return esClient.indices.delete({ index: '_all' });
};

// index MySQL database for elasticsearch based on tables
const indexDatabase = () => {
  deleteIndices()
  .then(() => {
    getAllFromDatabaseTables()
    .then((result) => {

        const data = result[0].concat(result[1]).concat(result[2]);
        if (data.length !== 0) {
          bulkIndex(dbName, 'object', data);
      }
    });
  });
};


// module.exports = exports = main;
exports.bulkIndex = bulkIndex;
exports.deleteIndices = deleteIndices;
exports.indexDatabase = indexDatabase;
exports.search = search;
