import { connect } from "mongoose";
import dotenv from 'dotenv';
import env from "../env";

dotenv.config();

async function runMongo(){
    await connect(env.DB_URL as string).catch((error) => console.log("ocorreu algum erro " + error));
};

export default runMongo;



