const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const https = require("https");
const cors = require("cors");
const passport = require('passport');
const { Server } = require('colyseus');
const { monitor } = require("@colyseus/monitor");
//const colyseus = require("colyseus.js");
require('dotenv').config();

const { MyRoom } = require("./rooms/MyRoom");
const { EvalMod } = require("./rooms/EvalMod");
const { SpeedMod } = require("./rooms/SpeedMod");

const urls = ['http://localhost:3000', 'https://linguistic-com.herokuapp.com', 'https://linguistic-com-qa.herokuapp.com']

app.use(cors({origin: '*'}));

app.use(bodyParser.json());

require('./config/passportConfig')(passport);
app.use(passport.initialize());

require('./index-v2.js')(app);

const server = https.createServer(app)
const gameServer = new Server({ server });

gameServer.define('my_room', MyRoom);
gameServer.define('evaluation', EvalMod);
gameServer.define('speed_duel', SpeedMod);


app.use("/colyseus", monitor());

gameServer.listen(process.env.PORT)
console.log("server started sur le port " + process.env.PORT);