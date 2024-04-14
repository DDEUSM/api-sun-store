import { NextFunction, Request, Response, query } from "express";
import ads from "../../models/Ads";
import { ITEMS_PER_PAGE, ITEM_SORT } from "../global-data";
import User from "../../models/User";
import utils from "./utils";
import { imageUrlDestiny } from "../../utils";
import { adAdapterToDb } from "./ad-adapters";
import Ads from "../../models/Ads";


async function createAd (req: Request, res: Response, next: NextFunction)
{    
    const file = req.file
    const adData = req.body

    const inputPath = "public/temp-images/products/"+file?.filename
    const outputPath = "public/images/products/"

    const imageUrl = imageUrlDestiny(inputPath, outputPath, file)
    adData.url_image = imageUrl

    const adaptedData = adAdapterToDb(adData)

    const newAd = new Ads(adaptedData)
    await newAd.save()
}

async function singleAds( req: Request, res: Response, next: NextFunction )
{ 
    const id_param = req.params.id;
    const result_ads = await ads.findById({"_id" : id_param});
    if(!result_ads)
    {
        const notFound = {status: 404, message: "Ads not found"};
        return next(notFound);
    }
    const user_creator = await User.findById(result_ads.id_user_creator, "-password_hash");
    if(!user_creator)
    {
        const notFound = {status: 404, message: "Ads not found"};
        return next(notFound);
    }
    res.json({ result_ads, user_creator });
};


async function getAllAds( req: Request, res: Response )
{
    const result_query = await ads.find({});
    res.json( result_query );
};


async function search( request: Request, response: Response, next: NextFunction )
{   
    const skipItemsConfig = ITEMS_PER_PAGE * ((Number(request.query.page) - 1));    
    const sort = ITEM_SORT[request.query.order as string]
    const priceFilter = utils.priceFilter(request.query.max_price as string, request.query.min_price as string)
    const filteredData = utils.queryParamsConfig (
        request.params.state,
        request.params.category, 
        request.params.sub_category,
        request.query.userId,
        request.query.title,
        priceFilter,
    )

    const result_query = await utils.query(filteredData, sort, skipItemsConfig)
    .catch((error: any) => {            
        const serverError = { status: 500, message: "Ocorreu algum erro no servidor."}
        throw new Error(JSON.stringify(serverError));
    }); 
    response.json(result_query)     
 };


async function searchCategory( request : Request, response : Response)
{
    const skipItemsConfig = ITEMS_PER_PAGE * ((Number(request.query.page) - 1));    
    const sort = ITEM_SORT[request.query.order as string]
    const priceFilter = utils.priceFilter(request.query.max_price as string, request.query.min_price as string)
    const filteredData = utils.queryParamsConfig (
        request.params.state,
        request.params.category, 
        request.params.sub_category,
        request.query.userId,
        request.query.title,
        priceFilter,
    )

    const result_query = await utils.query(filteredData, sort, skipItemsConfig)
    .catch((error: any) => {            
        const serverError = { status: 500, message: "Ocorreu algum erro no servidor."}
        throw new Error(JSON.stringify(serverError));
    }); 
    response.json(result_query)     
};


async function searchSubCategory( request : Request, response : Response)
{
    const skipItemsConfig = ITEMS_PER_PAGE * ((Number(request.query.page) - 1));    
    const sort = ITEM_SORT[request.query.order as string]
    const priceFilter = utils.priceFilter(request.query.max_price as string, request.query.min_price as string)
    const filteredData = utils.queryParamsConfig (
        request.params.state,
        request.params.category, 
        request.params.sub_category,
        request.query.userId,
        request.query.title,
        priceFilter,
    )

    const result_query = await utils.query(filteredData, sort, skipItemsConfig)
    .catch((error: any) => {            
        const serverError = { status: 500, message: "Ocorreu algum erro no servidor."}
        throw new Error(JSON.stringify(serverError));
    }); 
    response.json(result_query)     
};


export default { singleAds, getAllAds, search, searchCategory, searchSubCategory, createAd };