import { Request, Response } from "express";
import Categories from "../models/Categories";


async function getAllCategories(req : Request, res : Response){
    
    const result_query = await Categories.find({});
    res.json(result_query);
    
}

export default { getAllCategories };