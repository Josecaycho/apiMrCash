require("dotenv").config();

const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

const app = express();
    routerUser = require('./src/routes/user.routes.js')

// Settings
app.set("port", 4000);

// Middlewares
app.use(morgan("dev"));
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb'}))

app.use(cors({
    methods: ['GET','POST','DELETE','UPDATE','PUT','PATCH']
}));

// Routes campanias
app.get('/', (req, res) => {res.json('este es mi api')});
app.use("/api", routerUser)

const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`Listening on port ${port}`))
