import express, {ErrorRequestHandler, Request, Response} from 'express';
import path from 'path';
import cors from 'cors';
import dotenv from 'dotenv';
import routes from './routes/api-routes';
import runMongo from './instances/mongo-instance';
import connect_database from './instances/mongo-cluster-instance';
import passport from 'passport';
import userRoutes from './routes/api-user-routes';
import env from './env';
import { MulterError } from 'multer';


const server = express();
//connect_database();
runMongo();
server.use(express.static(path.join(__dirname, '../public')));
server.use(express.urlencoded({ extended : true }))
server.use(express.json())
server.use(cors());

server.use(passport.initialize());
server.use(routes);
server.use(userRoutes);
server.use((req : Request, res : Response) => {
    res.status(404);
    res.json({error : 'Endpoint não encontrado!'});
});
const errorHandler : ErrorRequestHandler = (err, req, res, next) => {
    if (err instanceof MulterError)
    {
       return res.status(400)
            .json({ error : "File is too large!" })
            .end()
    }
    else
    {
        return res.status(err.status? err.status : 500)
            .json(err.message? { error: err.message } : { error: "Ocorreu um erro inesperado!"})
    } 
}
server.use( errorHandler );
server.listen(env.PORT, () => console.log(`link: http://localhost:${env.PORT}`));