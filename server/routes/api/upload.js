var express = require("express")
var router = express.Router()
var mongojs = require("mongojs")
var db = mongojs("mongodb://localhost:27017/ShennyStore")

const fileUpload = require("express-fileupload")
const domS3 = require("../../../privValues")
const AWS = require('aws-sdk')

AWS.config.update({accessKeyId: domS3.AWS_ACCESS_KEY_ID, secretAccessKey: domS3.AWS_SECRET_ACCESS_KEY})
var s3 = new AWS.S3()

//test
var params = {
    Bucket: domS3.BUCKET_NAME,
    Key: 'mykey.txt',
    Body: "HelloWorld"
};
s3.putObject(params, function (err, res) {
    if (err) {
        console.log("Error uploading data: ", err);
    } else {
        console.log("Successfully uploaded data to myBucket/myKey");
    }
});


const uuid = require('uuid/v1')

var passport = require("passport")

// upload
router.post("/", [fileUpload(), authenticationMiddleware()], function(req, res) {
    
    if (!req.files)
        return res.status(400).send('No files were uploaded.')

    for(file in req.files){
        var randFileName = uuid()+".jpeg"

        params = {Bucket: domS3.BUCKET_NAME, Key: randFileName, Body: req.files[file].data, ACL: 'public-read'}
        s3.putObject(params, function(err, data){
            if(err){ 
                console.log("could not upload file '"+ file +"' error: "+err)
                res.json({error: "could not upload '"+ file +"' error: "+err})
            } else {
                console.log("Successfully uploaded data to myBucket/myKey: " + JSON.stringify(data))
                res.json({filename: randFileName}) // IMPORTANT - read filename for success on client-side
            }
        })

        // LOCAL UPLOAD --- not in use
        // req.files[file].mv('./uploads/'+randFileName, function(err){
        //     if (err) {
        //         console.log("could not move "+file+":"+randFileName+" to upload folder")
        //         res.json({error: "could not upload file: '"+file+"' "+err}) //if I have an error, dropzone will still show success because I cannot resend the header with 500
        //     } else
        //         res.json({filename: randFileName})
        // })
    }
})

// DO NOT SEND IMAGE FILE  .. sendFile is not a blob
/*app.get("/api/upload/:imgID", function(req, res){
    res.sendFile(__dirname+"/uploads/"+req.params.imgID+".jpeg")
    console.log("get Image: "+ req.params.imgID)
}) */


router.delete("/:filename", authenticationMiddleware(), function(req, res) {
    
    var s3 = new AWS.S3()
    params = {Bucket: domS3.BUCKET_NAME, Key: req.params.filename}
    s3.deleteObject(params, function(err, data){
        if (err){
            console.log("could not delete file '"+ req.params.filename +"' error: "+err)
            res.json({error: "could not delete '"+ req.params.filename +"' error: "+err})
        } else {
            console.log("Successfully deleted '"+ req.params.filename +"' from myBucket/myKey: " + JSON.stringify(data))
            res.json({deleted: req.params.filename})
        }
    })
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