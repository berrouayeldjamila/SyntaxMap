const Arena = require("@colyseus/arena").default;
const { monitor } = require("@colyseus/monitor");
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const http = require("http");
const cors = require("cors");
const passport = require('passport');
const multer = require('multer');
var multerParser = multer();
/**
 * Import your Room files
 */
const { MyRoom } = require("./rooms/MyRoom");
const { EvalMod } = require("./rooms/EvalMod");
const { SpeedMod } = require("./rooms/SpeedMod");

const urls = ['http://localhost:3000', 'https://linguistic-com.herokuapp.com', 'https://linguistic-com-qa.herokuapp.com']

module.exports = Arena({
    getId: () => "Your Colyseus App",

    initializeGameServer: (gameServer) => {
        /**
         * Define your room handlers:
         */
        gameServer.define('my_room', MyRoom);
        gameServer.define('evaluation', EvalMod);
        gameServer.define('speed_duel', SpeedMod);
    },

    initializeExpress: (app) => {
        /**
         * Bind your custom express routes here:
         */
        app.get("/", (req, res) => {
            res.send("It's time to kick ass and chew bubblegum!");
        });
        
        app.use(cors({allowedOrigins: urls}));
        
        app.use(multerParser.array());
        app.use(express.static('public'));

        app.use(bodyParser.json());

        
        require('./config/passportConfig')(passport);
        app.use(passport.initialize());

        require('./index-v2.js')(app);
        /**
         * Bind @colyseus/monitor
         * It is recommended to protect this route with a password.
         * Read more: https://docs.colyseus.io/tools/monitor/
         */
        app.use("/colyseus", monitor());
    },

    beforeListen: () => {
        /**
         * Before before gameServer.listen() is called.
         */
    }

});
