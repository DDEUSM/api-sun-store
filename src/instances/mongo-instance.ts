import { connect } from "mongoose";
import dotenv from 'dotenv';

dotenv.config();

async function runMongo(){
    await connect(process.env.URL_DB as string).catch((error) => console.log("ocorreu algum erro " + error));
};

export default runMongo;



