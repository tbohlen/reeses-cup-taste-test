/********************************************************************\
Project: reeses-cup-taste-test
File: server.js
Description: main server file
Author: Turner Bohlen (www.turnerbohlen.com)
Created: 08/16/2012
Copyright 2012 Turner Bohlen    
\********************************************************************/

var express = require('express')
    , mustache = require('./node-mustache.js')
    , fs = require('fs')
    , socketIO = require('socket.io')
    , timers = require('timers')
    , app = express.createServer()
    , votes;

// use html pages with render
app.set('view engine', 'html');

//configure app
app.configure(function() {
    app.set("views", __dirname + "/views");
    app.set("view options", {layout: false});
    app.register(".html", mustache);

    //app.use(express.logger());
    app.use(express.cookieParser());
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(express.session({ secret: '7oyjhqbjhkgcfadoyi', maxAge:1000 * 60 * 60 * 24 * 365}));
    //app.use(express.favicon(__dirname + '/../static/favicon.ico'));
    app.use(express.static(__dirname + '/public'), {maxAge: 31557600000});
    app.use(app.router);
});

app.configure('development', function(){
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
    app.use(express.errorHandler()); 
});

var io = socketIO.listen(app, {log: false});

io.sockets.on('connection', function (socket) {
    console.log('socket connection');
});

/*
 * Route: /?
 * Description...
 */
app.get('/?', function(req, res, next){
    var locals = {}
        , sess = req.session;
    if (sess.voted === null || typeof(sess.voted) === 'undefined') {
        sess.voted = false;
    }
    locals.canVote = !req.session.voted;
    locals.votes = votes;
    res.render("index.html", {locals: locals});
});

app.post('/vote/?', function(req, res, next) {
    var best = req.body.best
        , worst = req.body.worst;
    if (!req.session.voted) {
        req.session.voted = true;
        console.log('best is ' + best);
        console.log("worst is " + worst);
        votes[best]['best']++;
        votes[worst]['worst']++;
        io.sockets.emit('vote', best, worst);
        req.session.save();
    }
});

/*
 * Function: readJsonFile
 * Reads a path, parses it as json, and returns the resulting object to the
 * callback
 *
 * Parameters:
 * path - path to the file
 * callback - function to be called on completion. Must take an error and a
 * result as arguments
 */
function readJsonFile(path, callback) {
    fs.readFile(path, 'utf8', function(err, file) {
        var result;
        if (err !== null && typeof(err) !== 'undefined') {
            console.log('Error reading in JSON file: ' + path);
            callback(err, null);
        }
        else {
            try {
                result = JSON.parse(file);
                callback(null, result);
            }
            catch(e) {
                console.log('Error parsing JSON file: ' + e);
                callback(e, null);
            }
        }
    });
}

function saveJsonFile(path, data, callback) {
    var dataString = JSON.stringify(data);
    fs.writeFile(path, dataString, function(err) {
        if (err !== null && typeof(err) !== 'undefined') {
            console.log('Error saving data to file');
        }
        else {
            console.log('file saved successfully: ' + path);
        }
        if (typeof(callback) === 'function') {
            callback();
        }
    });
}

readJsonFile('./votes.json', function(err, result) {
    if (err !== null && typeof(err) !== 'undefined') {
        console.log('Could not load votes data!');
        votes = {
            mini: {
                best: 0
                , worst: 0
            }
            , miniature:{
                best: 0
                , worst: 0
            }
            , full:{
                best: 0
                , worst: 0
            }
            , big:{
                best: 0
                , worst: 0
            }
        }
    }
    else {
        votes = result;
        console.log('votes are ' + JSON.stringify(votes));
    }

});

// run the app!
app.listen(8080);

var saveInterval = timers.setInterval(function() {
    saveJsonFile("./votes.json", votes, function(){});
}, 60000);
