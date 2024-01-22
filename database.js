const mysql = require("mysql2/promise");
const dotenv = require("dotenv");

dotenv.config()

const connection = mysql.createPool({
    host: process.env.HOST || "",
    database: process.env.DATABASE || "",
    user: process.env.USER_CONECTION || "",
    password: process.env.PASSWORD || ""
})


module.exports = connection

