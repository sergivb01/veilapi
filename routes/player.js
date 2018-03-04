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
    host: "158.69.123.169",
    port: 6379,
    auth_pass: "c95668e7c556e6c096595310f33c95dd",
    expiry: 30
});



router.get('/:playername', /*cache.route(),*/ function(req, res, next) {
    var nick = req.params.playername;
    db.collection('playerdata').find({'nickname': nick}).toArray(function(err, docs) {
        if(err){
            console.log(err);
        }

        if(docs.length !== 1){
            res.json({
                "error": true,
                "message": "Player named " + nick + " not found or issue with database (duplicated profile?)"
                });
            return;
        }

        delete docs[0].address;
        delete docs[0]._id;
        docs[0].error = false;
        res.send(docs[0]);
    });
});

module.exports = router;
