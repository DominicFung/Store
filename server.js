const express = require("express")
const bodyParser = require("body-parser")
const path = require("path")
const http = require("http")

const helmet = require('helmet')

const session = require("express-session")
const passport = require("passport")
const MongoStore = require('connect-mongo')(session);

var uploadAPI = require("./server/routes/api/upload")
var storeAPI = require("./server/routes/api/store")
var LoginAPI = require("./server/routes/api/login")

var app = express()
app.use(helmet())

//allow cross-site for DEVELOPMENT
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*")
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
    )
    next()
})

// Parsers
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
//app.use(busboy)

// express session with passportjs and connect-mongo for session store
app.use(
    session({
        secret: "aaoknwodmbnalek",
        resave: false,
        saveUninitialized: false,
        store: new MongoStore({
            url:"mongodb://localhost:27017/ShennyStore"
        })
    })
)
app.use(passport.initialize())
app.use(passport.session())

// API
app.use("/api/upload", uploadAPI)
app.use("/api/store", storeAPI)
app.use("/api/authentication", LoginAPI)

// Angular DIST output folder
app.use(express.static(path.join(__dirname, "dist")))

// everything else goes to Angular
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist/index.html'));
})

// Set Port
const _port = process.env.PORT || "3000"
app.set("port", _port)

app.listen(_port, function() {
    console.log("server started on port: " + _port)
})

// mongod --dbpath d:\mongodata\db --port 27017
//https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/putty.html              -- install putty and use aws ec2 t2mirco server
//https://docs.mongodb.com/manual/tutorial/install-mongodb-on-amazon/         -- install mongodb on that server

//aws s3 cp --recursive s3://domnicfung-storecode /opt/Store

// aws s3 cp --recursive s3://domnicfung-storecode/src/app /opt/Store/src/app
// node server |& tee -a ./log/server.log
// ng build