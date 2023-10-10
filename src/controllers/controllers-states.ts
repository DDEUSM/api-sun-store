import { Request, Response } from "express";
import states from "../models/States";

async function getAllStates( req : Request, res : Response){

    const result_req = await states.find({});

    res.json(result_req);

};

export default { getAllStates };
