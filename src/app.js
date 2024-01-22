import express from "express";
import morgan from "morgan";
import cors from "cors";
// Routes
// import routerUser from "./routes/user.routes.js";

// const cors = require('cors');

const app = express();

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
// app.use("/api", routerUser)


export default app;
