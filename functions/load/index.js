require('firebase-functions/lib/logger/compat');
const {BigQuery} = require('@google-cloud/bigquery');

const bigquery = new BigQuery({projectId:'mm-sandbox-wasm-on-gcp'});
const dataset = bigquery.dataset('analytics');
const table = dataset.table('functions');

function insertHandler(err, apiResponse) {
  console.error(err);
}

exports.load = (message, context) => {
  const datastring = Buffer.from(message.data, 'base64').toString();
  const data = JSON.parse(datastring);
  console.log(`Message ${datastring} retrieved from PubSub.`);

  table.insert([data], insertHandler)
};
