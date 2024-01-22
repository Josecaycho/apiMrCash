import mysql from "promise-mysql";
import config from "./../config.js";

const connection = mysql.createConnection({
    host: "dmrcash.c3iykkqesh1q.us-east-1.rds.amazonaws.com",
    database: "mrcash",
    user: "admin",
    password: "Mrcashproyect"
});

const getConnection = () => {
    return connection;
};

export {getConnection}
