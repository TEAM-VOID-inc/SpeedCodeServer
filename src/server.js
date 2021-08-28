const express = require("express");
const http = require("http");
const mongoose = require('mongoose');
const cors = require('cors');
const passport = require("passport");
const path = require("path");
const {getgfgdata} = require('./socket/socketgfg');
const {getcodeforcesdata} = require('./socket/codeforces');
const {getspojdata} = require('./socket/spoj')
const {getcodechefdata} = require('./socket/codechef');


//connection uri and port
const connUri = process.env.MONGO_LOCAL_CONN_URL;

const app = express();

//for cors origin platform
app.use(cors());


// for parsing application/json
app.use(express.json());

// for parsing application/xwww-
app.use(express.urlencoded({ extended: false }));
//form-urlencoded

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');


//Configure mongoose's promise to global promise
mongoose.promise = global.Promise;
mongoose.connect(connUri, { useNewUrlParser: true , useCreateIndex: true,  useUnifiedTopology: true, useFindAndModify: true });

const connection = mongoose.connection;
connection.on('error', (err) => {
    process.exit();
});


//Middleware
app.use(passport.initialize());
require("./middlewares/jwt")(passport);


//Configure Route
require('./routes/index')(app);


//Socket building
const server = http.createServer(app);

const io = require("socket.io")(server, {
    cors: {
        origin: "*",
    },
});


io.on("connection", socket => {
    getgfgdata(socket);
    getcodeforcesdata(socket);
    getspojdata(socket);
    getcodechefdata(socket);
    socket.on("disconnect", () => console.log("CLIENT DISCONNECT"));
});

//listening server
server.listen(process.env.PORT || 3001);