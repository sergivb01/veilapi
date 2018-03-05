var express = require('express');
var db = require("mongodb");
var router = express.Router();
var mongo = require('mongodb');
var binary = mongo.Binary;
const MongoClient = mongo.MongoClient;
var host = process.env.PORT ? "158.69.123.169" : "localhost";
MongoClient.connect("mongodb://" + host + ":27017", function (err, client) {
    if (err) {
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

router.get('/:uuid/:server/:limit', /*cache.route(),*/ function (req, res, next) {
    var nick = req.params.uuid;
    var server = req.params.server;
    var limit = req.params.limit;

    if(limit > 20){
        res.json({
            "error": true,
            "message": "Max shown deaths is 20."
        });
        return;
    }

    db.collection('deaths').find({'killer_str': nick, "server": server},  { upsert:true }).sort(['timestamp', 'desc']).limit(parseInt(limit)).toArray(function (err, docs) {
        if (err) {
            console.log("Error! " + err);
        }

        for(var i = 0; i < docs.length; i++){
            delete docs[i]._id;
        }

        res.send(docs);
    });
});

module.exports = router;
