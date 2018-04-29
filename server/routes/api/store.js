var express = require("express")
var router = express.Router()
var mongojs = require("mongojs")
var db = mongojs("mongodb://localhost:27017/ShennyStore")

const AWS = require('aws-sdk')
const domS3 = require("../../../privValues")
AWS.config.update({accessKeyId: domS3.AWS_ACCESS_KEY_ID, secretAccessKey: domS3.AWS_SECRET_ACCESS_KEY})

var passport = require("passport")

// Get All items
router.get("/allItems", function(req, res, next) {
    db.Store.find(function(err, items) {
        if (err) {
            res.send(err)
        } else {
            console.log("asking for all items: "+ JSON.stringify(items))
            res.json(items)
        }
    })
})

// Get single item
router.get("/:id", function(req, res, next) {
    db.Store.findOne({ _id: mongojs.ObjectId(req.params.id) }, function(err, item) {
        if (err) {
            res.send(err)
        }
        res.json(item)
    })
})

// New item (protected)
router.post("/newItem", authenticationMiddleware(), function(req, res, next) {
    var item = req.body
    console.log(JSON.stringify(item))

    //check if all required fields are there
    if (!item.itemName || !item.price) {
        res.status(400)
        res.json({
            error: "missing required data"
        })
    } else {
        if (!item.inventory) {
            item.inventory = -1
        }
        if (!item.imgs) {
            item.imgs = []
        }
        if (!item.coverImg) {
            item.coverImg = ""
        }

        db.Store.save(item, function(err, item) {
            if (err) {
                console.log("error saving new Item: "+ err)
                res.send(err)
            }

            console.log("new item submitted:: "+ JSON.stringify(item))
            res.json("new item submitted")
        })
    }
})

// Delete item (protected)
router.delete("/:id", authenticationMiddleware(), function(req, res, next) {

    db.Store.findOne({ _id: mongojs.ObjectId(req.params.id) }, function(err, item) {
        if (err) { res.send(err) }
        else if (item) {
            if (item.coverImg) {
                var s3 = new AWS.S3()
                params = {Bucket: domS3.BUCKET_NAME, Key: item.coverImg}
                s3.deleteObject(params, function(err, data){
                    if (err){
                        console.log("could not delete file '"+ item.coverImg +"' error: "+err)
                    } else {
                        console.log("Successfully deleted '"+ item.coverImg +"' from myBucket/myKey: " + JSON.stringify(data))
                    }
                })
            }
    
            for( img in item.imgs ) {
                var s3 = new AWS.S3()
                params = {Bucket: domS3.BUCKET_NAME, Key: img}
                s3.deleteObject(params, function(err, data){
                    if (err){
                        console.log("could not delete file '"+ img +"' error: "+err)
                    } else {
                        console.log("Successfully deleted '"+ img +"' from myBucket/myKey: " + JSON.stringify(data))
                    }
                })
            }
    
            db.Store.remove({ _id: mongojs.ObjectId(req.params.id) }, function(err, item) {
                if (err) { res.send(err) }
        
                console.log("DELETING: "+JSON.stringify(item))
                res.json(item)
            })
        } else { 
            console.log("Trying to Delete again:: image did not refresh causing user to click again") 
            res.json({ error: "Trying to Delete again, refreshing page" })
        }
    })
})

//Update item (protected)
router.put("/:id", authenticationMiddleware(), function(req, res, next) {
    var item = req.body
    var updItem = {}

    //setup update
    if (item.itemName) {
        updItem.itemName = item.itemName
    }
    if (item.price) {
        updItem.price = item.price
    }
    if (item.inventory) {
        updItem.inventory = item.inventory
    }
    if (item.imgs) {
        updItem.imgs = item.imgs
    }
    if (item.description) {
        updItem.description = item.description
    }
    if (item.coverImg) {
        updItem.coverImg = item.coverImg
    }

    //check that at lease 1 thing is changed
    if (!updItem) {
        res.status(400)
        res.json({
            error: "no updates made"
        })
    } else {
        db.Store.update(
            { _id: mongojs.ObjectId(req.params.id) },
            updItem,
            {},
            function(err, item) {
                if (err) {
                    res.send(err)
                }
                res.json(item)
            }
        )
    }
})

function authenticationMiddleware() {
    return (req, res, next) => {
        console.log(`req.session.passport.user: ${JSON.stringify(req.session.passport)}`)

        if(req.isAuthenticated()) return next()
        
        res.json({
            authError: "session has expired"
        })
    }
}

module.exports = router
