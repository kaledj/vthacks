//
// # SimpleServer
//
// A simple chat server using Socket.IO, Express, and Async.
//
var http = require('http');
var path = require('path');
var twitter = require('twitter');
var async = require('async');
var socketio = require('socket.io');
var express = require('express');

//
// ## SimpleServer `SimpleServer(obj)`
//
// Creates a new instance of SimpleServer with the following options:
//  * `port` - The HTTP port to listen on. If `process.env.PORT` is set, _it overrides this value_.
//
var router = express();
var server = http.createServer(router);
var io = socketio.listen(server);

//router.use(express.static(path.resolve(__dirname, 'client')));
router.set('view engine', 'ejs');
console.log(__dirname + "/client");
router.use(express.static(__dirname + "/client"));

var messages = [];
var sockets = [];

io.on('connection', function (socket) {
    messages.forEach(function (data) {
      socket.emit('message', data);
    });

    sockets.push(socket);

    socket.on('disconnect', function () {
      sockets.splice(sockets.indexOf(socket), 1);
      updateRoster();
    });

    socket.on('message', function (msg) {
      var text = String(msg || '');

      if (!text)
        return;

      socket.get('name', function (err, name) {
        var data = {
          name: name,
          text: text
        };

        broadcast('message', data);
        messages.push(data);
      });
    });

    socket.on('identify', function (name) {
      socket.set('name', String(name || 'Anonymous'), function (err) {
        updateRoster();
      });
    });
  });

function updateRoster() {
  async.map(
    sockets,
    function (socket, callback) {
      socket.get('name', callback);
    },
    function (err, names) {
      broadcast('roster', names);
    }
  );
}

function broadcast(event, data) {
  sockets.forEach(function (socket) {
    socket.emit(event, data);
  });
}
server.listen(process.env.PORT, function(){
  var addr = server.address();
  console.log("Chat server listening at", addr.address + ":" + addr.port);
});

function getTweets(callback){
  var client = new twitter({
        consumer_key : "tVbuGxuozzM85fsC3P8ZdwdhR",
        consumer_secret : "4SUnMeuWCFp2QhoxpjtysiodmlZ7riDb88Pjwr7KAm79axs7NZ",
        access_token_key : "2844620313-CaBkrSwj4jsWtXIEw2DhOHN1ZyZEBDLIcaQzyTN",
        access_token_secret : "ucaOKKi3dOEsPyXdPyW5OYBjxdR7MPOJYUNzptHi0A3Cb"
    })


/**var params = {url:"st79375"};
client.get('statuses/user_timeline', params, function(error, tweets, response){
        if (!error) {
            console.log(error);
        }
        callback(response.body);
    });
*/

client.get('https://api.twitter.com/1.1/search/tweets.json?count=2&q=%23superbowl&result_type=recent', function(error, tweets, response){
        if (!error) {
            console.log(error);
        }
        callback(response.body);
    });
//https://api.twitter.com/1.1/search/tweets.json?
}

router.get("/", function (req, res) {
  var ejs = require('ejs');
  getTweets(function (data) {
    //console.log(data);
    var fullobj = JSON.parse(data).statuses[0];
    var data = {
      //tweettext: fullobj.text,
      //tweetsname: fullobj.user.screen_name,
      //profilepic: fullobj.user.profile_image_url
      
      tweettext: fullobj.text,
      tweetsname: fullobj.user.screen_name,
      profilepic: fullobj.user.profile_image_url
    };
    
    console.log(data.tweettext);
    var tweetdict = [];
    tweetdict.push(data);
    
    require("fs").readFile(__dirname + '/client/index.ejs', "utf8", function (err, html) {
      if (err != null) console.log(err);
      res.send(ejs.render(html, {tweetdict: tweetdict}));
    });
  });
})
