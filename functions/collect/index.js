require('firebase-functions/lib/logger/compat');
const {PubSub} = require('@google-cloud/pubsub');

const pubsub = new PubSub({projectId:'mm-sandbox-wasm-on-gcp'});

async function publishMessage(data) {
  const dataBuffer = Buffer.from(data);
  const messageId = await pubsub.topic('projects/mm-sandbox-wasm-on-gcp/topics/wasm-on-gcp').publish(dataBuffer);
  console.log(`Message ${messageId} published to PubSub.`);
}

exports.collect = (req, res) => {
  res.set('Access-Control-Allow-Origin', "*");

  data = JSON.stringify(req.query);
  publishMessage(data).catch(console.error);

  res.sendStatus(200);
};
