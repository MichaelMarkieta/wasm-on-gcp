require('firebase-functions/lib/logger/compat');
const {BigQuery} = require('@google-cloud/bigquery');

const bigquery = new BigQuery({projectId:'mm-sandbox-wasm-on-gcp'});
const dataset = bigquery.dataset('analytics');
const table = dataset.table('functions');

function insertHandler(err, apiResponse) {
  err.errors.forEach((a,b) => {
    console.log(err.errors[b]);
    // err.errors[b].errors.forEach((c,d) => {
    //   console.error(err.errors[b].errors[d].reason);
    //   console.error(err.errors[b].errors[d].message);
    // });
  });
}

exports.load = (message, context) => {
  const datastring = Buffer.from(message.data, 'base64').toString();
  const data = JSON.parse(datastring);
  console.log(`Message ${datastring} retrieved from PubSub.`);

  table.insert(data, insertHandler)
};
