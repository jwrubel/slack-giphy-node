# slack-giphy-node

A tiny library that does one thing; post a GIF to slack. 
An example use case is posting a notification to a deployment channel everytime your app restarts, or posting a make it rain GIF everytime you recieve money through your app.

# Install

```bash
npm i slack-giphy-node
```

# Usage

Simply require the library in your app and pass your Giphy API key and Slack webhook URL to it:
```js
require('slack-giphy-node')({
  giphyAPIKey: 'dc6zaTOxFJmzC',
  webhookUrl: 'https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXXXXXX'
});
```
You can also pass the following optional properties for extra control:

`tag`: The GIF tag to limit randomness by.
`rating`: Limit results to those rated (y,g, pg, pg-13 or r). Default is pg.
`text`: Add a text to the slack message in addition to the GIF.
