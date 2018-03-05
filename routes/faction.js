var express = require('express');
var db = require("mongodb");
var router = express.Router();
const MongoClient = require('mongodb').MongoClient;
var host = process.env.PORT ? "158.69.123.169" : "localhost";
MongoClient.connect("mongodb://" + host + ":27017", function(err, client) {
    if(err){
        console.log("Error! " + err)
    }
    console.log("Connected successfully to server");

    db = client.db("serverutils");

    //client.close();
});


var cache = require('express-redis-cache')({
    host: host,
    port: 6379,
    auth_pass: "c95668e7c556e6c096595310f33c95dd",
    expiry: 30
});



router.get('/:faction/:server', /*cache.route(),*/ function(req, res, next) {
    var nick = req.params.faction;
    var server = req.params.server;

    db.collection('factions').find({'name': nick, "server": server}).toArray(function(err, docs) {
        if(err){
            console.log(err);
        }

        if(docs.length == 0){
            res.json({
                "error": true,
                "message": "Faction named " + nick + " not found."
            });
            return;
        }

        for(var i = 0; i < docs.length; i++) {
            delete docs[i]._id;
        }
        docs.error = false;
        res.send(docs);
    });
});

module.exports = router;
