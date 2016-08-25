'use strict';

const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const options = {
  slack: {
    messageText: 'It works!'
  },
  giphy: {
    apiKey: 'dc6zaTOxFJmzC',
    tag: 'code test passed',
    rating: 'pg'
  }
};

rl.question('Slack Webhook URL: ', slackWebhookUrl => {
  options.slack.webhookUrl = slackWebhookUrl;
  require('./index')(options);
  rl.close();
});

