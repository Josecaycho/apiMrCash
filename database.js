const mysql = require("mysql2/promise");
const dotenv = require("dotenv");

dotenv.config()

const connection = mysql.createPool({
    host: process.env.HOST || "",
    database: process.env.DATABASE || "",
    user: process.env.USER_CONECTION || "",
    password: process.env.PASSWORD || "",
    multipleStatements: true,
    timezone: '+05:00',
    connectionLimit: 10
})


module.exports = connection

