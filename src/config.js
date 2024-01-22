import { config } from "dotenv";

config();

export default {
    host: process.env.HOST || "bdmrcash.c3iykkqesh1q.us-east-1.rds.amazonaws.com",
    database: process.env.DATABASE || "mrcash",
    user: process.env.USER || "admin",
    password: process.env.PASSWORD || "Mrcashproyect",
};
