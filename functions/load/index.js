require('firebase-functions/lib/logger/compat');
const {BigQuery} = require('@google-cloud/bigquery');

const bigquery = new BigQuery({projectId:'mm-sandbox-wasm-on-gcp'});
const dataset = bigquery.dataset('analytics');
const table = dataset.table('functions');

function insertHandler(err, apiResponse) {
  for (const x of err.errors){
    for (const y of err.errors[x-1].errors){
      console.error(err.errors[x-1].errors[y-1].reason);
      console.error(err.errors[x-1].errors[y-1].message);
    }
  }
}

exports.load = (message, context) => {
  const datastring = Buffer.from(message.data, 'base64').toString();
  const data = JSON.parse(datastring);
  console.log(`Message ${datastring} retrieved from PubSub.`);

  table.insert(data, insertHandler)
};
