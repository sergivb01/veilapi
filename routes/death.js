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

router.get('/:uuid', /*cache.route(),*/ function (req, res, next) {
    var nick = req.params.uuid;
    db.collection('deaths').find({'dead_str': nick},  { upsert:true }).limit(20)
        .toArray(function (err, docs) {
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
