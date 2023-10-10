import mongoose from "mongoose";
import dotenv from 'dotenv';

dotenv.config();
const options = {
    useNewUrlParser : true, 
    useUnifiedTopology : true 
} as mongoose.ConnectOptions;

const connect_database = async() => {
    console.log('Wait connect to database');
    await mongoose.connect(process.env.URL_DB as string, options)
    .then(() => console.log('A conexão deu certo!'))
    .catch((error) => console.log(`Aconteceu alguma problema na cenexão. ${error}`));
}

export default connect_database;