var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var app = express();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
//app.use(express.static(path.join(__dirname, 'public')));

var cors = require('cors');
app.use(cors());

var index = require('./routes/index');
var users = require('./routes/player');
var factions = require('./routes/faction');
var deaths = require('./routes/death');
var kills = require('./routes/kill');
var leaderboard = require('./routes/leaderboard');
var search = require('./routes/search');

app.use('/', index);
app.use('/player', users);
app.use('/faction', factions);
app.use('/deaths', deaths);
app.use('/kills', kills);
app.use('/leaderboard', leaderboard);
app.use('/search', search);

//404 handler
app.use(function(req, res, next) {
    res.json({
        "error": true,
        "message": "Invalid API usage or 404."
    });
  next();
});


// error handler
app.use(function(err, req, res, next) {
    console.log(err);
  res.json({
     "error": true,
     "message": err
  });
});

module.exports = app;
