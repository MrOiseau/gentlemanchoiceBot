'use strict'

const express = require('express');
const bodyParser = require('body-parser');
const request = require('request'); //dodao 

const app = express();

app.set('port', (process.env.PORT || 5000));
// console.log(process.env.PORT)

// Process application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}));

// Process application/json
app.use(bodyParser.json());

// Index route
app.get('/', function (req, res) {
    res.status(200).send('Zdravo! Ja sam četbot. Napiši mi nešto.')
});

// for Facebook verification
app.get('/webhook/', function (req, res) {
    console.log(req)
    if (req.query['hub.verify_token'] === 'gentlemanchoicebottoken'  ) {
        res.send(req.query['hub.challenge'])
    }
    res.send('Error, wrong token')
});

// Spin up the server
app.listen(app.get('port'), function() {
    console.log('Server running on port', app.get('port'))
});



app.post('/webhook', function (req, res) {
    var data = req.body;
    // console.log(data.object)
    // Make sure this is a page subscription
    if (data.object === 'page') {
  
      // Iterate over each entry - there may be multiple if batched
      data.entry.forEach(function(entry) {
        var pageID = entry.id;
        var timeOfEvent = entry.time;
  
        // Iterate over each messaging event
        entry.messaging.forEach(function(event) {
          if (event.message) {
            receivedMessage(event);
          } else {
            console.log("Webhook received unknown event: ", event);
          }
        });
      });
  
      // Everything went well.
      //
      // You must send back a 200, within 20 seconds, to let the platform know
      // you've successfully received the callback. Otherwise, the request
      // will time out and Fawebook Messenger Platform will keep trying to resend.
      // res.sendStatus(200);
      res.status(200).send();
    }
  });
  
  function receivedMessage(event) {
    // echo the received message for now
    console.log("Message data: ", event.message);
  }