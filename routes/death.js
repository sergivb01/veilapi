var express = require('express');
var db = require("mongodb");
var router = express.Router();
const MongoClient = require('mongodb').MongoClient;
MongoClient.connect("mongodb://158.69.123.169:27017", function(err, client) {
    if(err){
        console.log("Error! " + err)
    }
    console.log("Connected successfully to server");

    db = client.db("serverutils");

    //client.close();
});


var cache = require('express-redis-cache')({
    host: "158.69.123.169",
    port: 6379,
    auth_pass: "c95668e7c556e6c096595310f33c95dd",
    expiry: 30
});



router.get('/:uuid', /*cache.route(),*/ function(req, res, next) {
    var nick = "REgnAGk2+tYctM1922/otw==";
    db.collection('deaths').find({'dead': req.mongo.Binary(nick)}).toArray(function(err, docs) {
        if(err){
            console.log(err);
        }

        res.send(docs);
    });
});

module.exports = router;
