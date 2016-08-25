'use strict';

const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const options = {
  giphyAPIKey: 'dc6zaTOxFJmzC',
  text: 'It works!',
  tag: 'code test passed',
  rating: 'pg'
};

rl.question('Slack Webhook URL: ', slackWebhookUrl => {
  options.webhookUrl = slackWebhookUrl;
  require('./index')(options);
  rl.close();
});

