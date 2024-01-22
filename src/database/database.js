import mysql from "promise-mysql";
import config from "./../config.js";

const connection = mysql.createConnection({
    connectionLimit: 10,
    host: config.host,
    database: config.database,
    user: config.user,
    password: config.password,
    insecureAuth : true,
    port: 3002
});

const getConnection = () => {
    return connection;
};

export {getConnection}
