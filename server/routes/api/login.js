var express = require("express")
var router = express.Router()
var mongojs = require("mongojs")
var ObjectId = require('mongojs').ObjectId
var passport = require("passport")
const uuid = require('uuid/v1')

var db = mongojs("mongodb://localhost:27017/ShennyStore")

router.get("/", function(req, res, next){

    if(req.isAuthenticated())
    db.StoreAdmin.findOne(ObjectId(req.session.passport.user.toString()), function(err, authUser){
        if(err){
            console.log(err)
            res.status(400)
            res.json({ error: "server error" })
        } else {
            if(authUser){
                console.log(JSON.stringify(authUser))
                console.log("check admin found!:: "+authUser.username+" "+authUser._id.toString())
                res.json({
                    userId: authUser._id.toString(),
                    username: authUser.username
                })
            } else {
                console.log("checked user:: not found")
                res.status(400)
                res.json({
                    error: "not found"
                })
            }
        }
    })
    else {
        console.log("checked user:: no user found")
        res.json({
            authError: "guest"
        })

    }
})

router.post("/", function(req, res, next) {
    var user = req.body

    console.log("Login attempt")

    if (!user.username || !user.password) {
        res.status(400)
        res.json({
            error: "missing required data"
        })
    } else {
        db.StoreAdmin.findOne({ 
            username: user.username, 
            password : user.password 
        }, function(err, authUser) {
            if(err) {
                console.log(err)
                res.status(400)
                res.json({
                    error: "server error"
                })
            } else {
                if(authUser) {
                    console.log('user found!:: '+authUser.username+" "+authUser._id.toString())
                    req.login(authUser._id.toString(), function(err){

                        if(err){
                            res.status(400)
                            res.json({error: "cookie was not set:: please allow cookies"})
                        } else {
                            res.status(200)
                            res.json({
                                username: authUser.username,
                                userId: authUser._id.toString()
                            })
                        }
                    })
                } else {
                    console.log('user/password not correct or found:: unauthenticated')
                    res.status(200)
                    res.json({
                        authError: "username/password is incorrect"
                    })
                }
            }
        })
    }
})

router.delete("/", function(req, res, next){
    if (req.isAuthenticated()){
        console.log(JSON.stringify(req.session.passport)+" logged out")
        req.logout()
        req.session.destroy()
    } else {
        console.log("logout attempt:: failed - user not found")
    }
})

passport.serializeUser(function(user_id, done){
    done(null, user_id)
})

passport.deserializeUser(function(user_id, done){
    done(null, user_id)
})

function authenticationMiddleware() {
    return (req, res, next) => {
        console.log(`req.session.passport.user: ${JSON.stringify(req.session.passport)}`)

        if(req.isAuthenticated()) return next()
        
        res.json({
            authError: "unauthorized"
        })
    }
}

module.exports = router