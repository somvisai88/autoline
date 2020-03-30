
'use strict';

//------------------------2020-03-30--------------------------
var mysql = require('mysql');

const Geocoder = require('pickpoint-geocoder');
const geocoder = new Geocoder('RoThxrMEAx74F38zHYuZ');

var con = mysql.createConnection({
  host: "113.11.252.64",
  user: "Visai",
  password: "Visai@MANGO20180801",
  database: "mangotracking"
});
//-------------------------------------------------------------

const line = require('@line/bot-sdk');
const express = require('express');

// create LINE SDK config from env variables
const config = {
  channelAccessToken: "a5meHvwX95HEIUiz7fnUyQ/OMxWq9Ysv1LgMwcQI29QZ7FCfu3xNdyZKx6I6WQQug7trLyQI5i+Wxpqm6BO3ztd1HJVxWFNIxAvjD3Wch/yUgtxw93AuQlgz+x5xostLXFuoQCcVvjFtj3t1fdE7EAdB04t89/1O/w1cDnyilFU=",
  channelSecret: "8584a592bc44032eb7ca2bf8e97e04d0",
};

// create LINE SDK client
const client = new line.Client(config);

// create Express app
// about Express itself: https://expressjs.com/
const app = express();

// register a webhook handler with middleware
// about the middleware, please refer to doc
app.post('/callback', line.middleware(config), (req, res) => {
  Promise
    .all(req.body.events.map(handleEvent))
    .then((result) => res.json(result))
    .catch((err) => {
      console.error(err);
      res.status(500).end();
    });
});

// event handler
function handleEvent(event) {
  if (event.type !== 'message' || event.message.type !== 'text') {
    // ignore non-text-message event
    return Promise.resolve(null);
  }

  // create a echoing text message
  var echo = { type: 'text', text: event.message.text };

  con.connect(function(err) {
    if (err) throw err;
    echo.message = 'Connected!';  
  });  

  // use reply API
  return client.replyMessage(event.replyToken, echo);
  //return client.pushMessage('Cc63b5e76eb484ba40949683094cdf692',res.display_name);
}

// listen on port
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`listening on ${port}`);
});


