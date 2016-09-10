'use strict';

var https  = require('https');

/**
 * Makes a GET request to the GIPHY api to get a random GIF
 * @param {object} options
 * @param {string} options.giphyAPIKey The API key for api.giphy.com. You can request one from http://api.giphy.com/submit
 * @param {string} [options.tag=''] The GIF tag to limit randomness by.
 * @param {string} [options.rating='pg'] limit results to those rated (y,g, pg, pg-13 or r)
 * @return {Promise} The GIF
 */
function getGIF(options) {
  if (!options || typeof options.giphyAPIKey !== 'string') throw new TypeError('no giphyAPIKey passed');

  const reqOptions = {
    hostname: 'api.giphy.com',
    path: `/v1/gifs/random?api_key=${options.giphyAPIKey}&rating=${options.rating}`,
    headers: { 'Content-Type': 'application/json' }
  };

  if (options.tag) options.path += '&tag=' + options.tag.replace(/\s/g, '+');

  return new Promise((resolve, reject) => https.request(reqOptions, res => {
    if (res.statusCode === 200) {
      let str = '';
      res.on('data', chunk => str += chunk);
      res.on('end', () => resolve(JSON.parse(str).data));
    } else {
      reject('Error getting GIF ' + res.statusCode);
    }
  }).end());
}

/**
 * Posts a message to slack
 * @param {object} options
 * @param {string} options.webhookUrl The webhook URL to post to. For more information: https://api.slack.com/incoming-webhooks
 * @param {string} [options.text=''] The text of the message to post to slack
 * @param {object} [img={}] The image to attach to the message
 * @param {string} [img.url=''] The URL of the attached image
 * @param {string} [img.caption=''] The caption of the attached image
 * @return {Promise} The response to the POST request
 */
function postToSlack(options, img = {}) {
  if (!options || typeof options.webhookUrl !== 'string') throw new TypeError('no slackWebookUrl passed');

  var slackMessage = JSON.stringify({
    text: options.text,
    attachments: [
      {
        fallback: img.caption,
        image_url: img.url
      }
    ]
  });

  let reqOptions = {
    host: 'hooks.slack.com',
    path: options.webhookUrl.substr(options.webhookUrl.indexOf('/services/')),
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': slackMessage.length
    },
    method: 'POST'
  };

  return new Promise((resolve, reject) => {
    var req = https.request(reqOptions, res => res.statusCode === 200 ? resolve(res) : reject(new Error('Failed to post to Slack. Is the Webhook URL valid?')));
    req.write(slackMessage);
    req.end();
  });
}

/**
 * Gets a GIF from giphy.com and posts it to slack
 * @param {object} options
 * @param {string} options.giphyAPIKey The API key for api.giphy.com. You can request one from http://api.giphy.com/submit
 * @param {string} [options.tag=''] The GIF tag to limit randomness by.
 * @param {string} [options.rating='pg'] limit results to those rated (y,g, pg, pg-13 or r)
 * @param {string} options.webhookUrl The webhook URL to post to. For more information: https://api.slack.com/incoming-webhooks
 * @param {string} [options.text=''] The text of the message to post to slack
 */
module.exports = options => {
  return getGIF(options).then(
    image => postToSlack(
      options,
      {
        url: image.fixed_height_downsampled_url,
        caption: image.caption
      }
    ),
    err => postToSlack(options)
  );
};
