import express from "express";
import morgan from "morgan";
// Routes
import campaniasRoutes from "./routes/campanias.routes";
import variedadRoutes from "./routes/variedad.routes";
import filasRoutes from "./routes/filas.routes";
import materialesRoutes from "./routes/materiales.routes";
import routerUser from "./routes/user.routes";

const cors = require('cors');

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
app.use("/api/campanias", campaniasRoutes);
app.use("/api/variedad", variedadRoutes);
app.use("/api/filas", filasRoutes);
app.use("/api/materiales", materialesRoutes);
app.use("/api", routerUser)

export default app;
