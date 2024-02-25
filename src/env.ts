import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT;
const ADDRESS = process.env.ADDRESS;
const DB_URL = process.env.DB_URL;
const JWT_SECRET = process.env.JWT_SECRET;

export default {
    PORT,
    ADDRESS,
    DB_URL,
    JWT_SECRET
}