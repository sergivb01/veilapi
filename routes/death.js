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
    var nick = req.params.uuid.replace(";", "/");
    db.collection('deaths').find({'death': nick}).toArray(function(err, docs) {
        if(err){
            console.log(err);
        }

        if(docs.length == 0){
            res.json({
                "error": true,
                "message": "There are no deaths saved for UUID " + nick
            });
            return;
        }

        res.send(docs);
    });
});

module.exports = router;
