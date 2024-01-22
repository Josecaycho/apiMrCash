import dotoenv from "dotenv";

dotoenv.config();

export default {
    host: process.env.HOST || "",
    database: process.env.DATABASE || "",
    user: process.env.USER_CONECTION || "",
    password: process.env.PASSWORD || "",
};
