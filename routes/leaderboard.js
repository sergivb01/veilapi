var express = require('express');
var db = require("mongodb");
var router = express.Router();
const MongoClient = require('mongodb').MongoClient;
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

router.get('/:srv/:type', /*cache.route(),*/ function (req, res, next) {
    var srv = req.params.srv;
    var type = req.params.type;
    db.collection('playerdata').find({}).sort([srv + '.profile.' + type, 'desc']).limit(10).toArray(function (err, docs) {
        if (err) {
            console.log(err);
        }
        if (docs.length == 0) {
            res.json({
                "error": true,
                "message": "There is no data!"
            });
            return;
        }

        var delkits = srv !== "kits";
        var delhcf = srv !== "hcf";
        var dellite = srv !== "lite";

        for (var i = 0; i < docs.length; i++) {
            delete docs[i]._id;
            delete docs[i].address;
            if(delkits){
                delete docs[i].kits;
            }
            if(delhcf){
                delete docs[i].hcf;
            }
            if(dellite){
                delete docs[i].lite;
            }
        }
        docs.error = false;
        res.send(docs);
    });
});

module.exports = router;
