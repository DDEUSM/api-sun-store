import express, {ErrorRequestHandler, Request, Response} from 'express';
import path from 'path';
import cors from 'cors';
import dotenv from 'dotenv';
import routes from './routes/api-routes';
import runMongo from './instances/mongo-instance';
import connect_database from './instances/mongo-cluster-instance';
import passport from 'passport';
import userRoutes from './routes/api-user-routes';


dotenv.config();

const server = express();
connect_database();
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
    err.status? 
        res.status(err.status)
    :
        res.status(400)
    err.message?
        res.json({ error : err.message })
    :
        res.json({ error : 'Ocorreu algum erro' })    
};
server.use( errorHandler );
server.listen(process.env.PORT, () => console.log(`link: http://localhost:${process.env.PORT}`));