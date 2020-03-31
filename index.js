
'use strict';

//------------------------2020-03-30--------------------------
var mysql = require('mysql');

const Geocoder = require('pickpoint-geocoder');
const geocoder = new Geocoder('RoThxrMEAx74F38zHYuZ');

const con = mysql.createConnection({
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
con.connect(function(err) {
  if (err) throw err;
});  

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

function timezoneConv(timezone, localTimeZone){   
var _timezone = timezone.split(' ');
var _date = _timezone[0];
var _splitDate = _date.split('-');	
var _splitTime = _timezone[1].split(':');	
var _hour   	=	parseInt(_splitTime[0]);
var _minute	=	_splitTime[1];
var _second	=	_splitTime[2];
_hour	=	_hour + localTimeZone;  
  
var _timezoneConv = [_splitDate[0],_splitDate[1],_splitDate[2],_hour, _minute,_second];
  return _timezoneConv;
}	

// event handler
function handleEvent(event) {
  if (event.type !== 'message' || event.message.type !== 'text') {
    // ignore non-text-message event
    return Promise.resolve(null);
  }

  var _echo = { type: 'text', text: event.message.text };
  
  con.query("select *from gs_user_events_data ORDER BY event_id DESC LIMIT 1", function (err, result, fields) {
    if (err) throw err;
    var _dt_server = new Date(result[0].dt_server).toISOString().slice(0, 19).replace('T', ' ');    
    var _timezone = timezoneConv(_dt_server,7); 
    var _geocoder;

    geocoder.reverse(result[0].lat,result[0].lng).then(_geocoder => {
      var _lineMessage ='Line Alert ' + result[0].event_desc + ' \n' + 
              '==========Details==========\n' +
              'On ' + _timezone[0] + '-' + _timezone[1] + '-' + _timezone[2] + ' At ' + _timezone[3] + ':' + _timezone[4] + '\n' +
              result[0].name + '\n' +
              'Location address is ' + _geocoder.display_name + '\n'+
              'Click on map link below \n' +
              'http://maps.google.com/?q=' + result[0].lat + ',' + result[0].lng;
      
      var _echo1 = {type: 'text',text: _lineMessage };
            
      return client.replyMessage(event.replyToken, _echo1);

    });       
  });
}

// listen on port
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`listening on ${port}`);
});

 var _echo2 = {type:'text', text: 'Loop Testing'};
function intervalFunc() {
  
  con.query("select *from gs_user_events_data ORDER BY event_id DESC LIMIT 1", function (err, result, fields) {
    if (err) throw err;
    var _dt_server = new Date(result[0].dt_server).toISOString().slice(0, 19).replace('T', ' ');    
    var _timezone = timezoneConv(_dt_server,7); 
    var _geocoder;

    geocoder.reverse(result[0].lat,result[0].lng).then(_geocoder => {
      var _lineMessage ='Line Alert ' + result[0].event_desc + ' \n' + 
              '==========Details==========\n' +
              'On ' + _timezone[0] + '-' + _timezone[1] + '-' + _timezone[2] + ' At ' + _timezone[3] + ':' + _timezone[4] + '\n' +
              result[0].name + '\n' +
              'Location address is ' + _geocoder.display_name + '\n'+
              'Click on map link below \n' +
              'http://maps.google.com/?q=' + result[0].lat + ',' + result[0].lng;
      
      var _echo1 = {type: 'text',text: _lineMessage };            
      return client.pushMessage('Cc63b5e76eb484ba40949683094cdf692', _echo1);
    });       
  });
}

//setInterval(intervalFunc, 60000);
