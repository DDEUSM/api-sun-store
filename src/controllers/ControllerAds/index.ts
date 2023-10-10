import { NextFunction, Request, Response } from "express";
import ads from "../../models/Ads";
import { items_per_page } from "../items_per_page";
import User from "../../models/User";
import utils from "./utils";


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
    const {
        state,
        category,
        sub_category
    } = request.params;    
    
    const userId = request.query.userId;
    const title  = request.query.title;    
    const pageQuery = parseInt(request.query.page as string); 
    const maxPrice = request.query.max_price; // Me certificar de nunca enviar valor nulo
    const minPrice = request.query.min_price;
    const sort = request.query.order as string;        
    
    const priceFilterConfig = utils.priceFilterConfig(minPrice as string, maxPrice as string);
    const sortConfig = utils.sortConfig(sort); // Não posso enviar um undefined para sort
    const skipItemsConfig = utils.skipItemsConfig(items_per_page, pageQuery);

    const executeProcess = new Promise((resolve,) => resolve(utils.queryParamsConfig(
        state,
        category, 
        sub_category,
        userId,
        title,
        priceFilterConfig,
    )))

    await executeProcess
    .then( objectQuery => utils.requestData(
        sortConfig,
        items_per_page,
        skipItemsConfig,
        objectQuery
    ))
    .then(resultQuery => response.json(resultQuery))
    .catch(error => {
        const errorReason: string = error.toString().slice(6);  
        const errorReasonJson = JSON.parse(errorReason);
        next(errorReasonJson);
    });    
 };


async function searchCategory( req : Request, res : Response)
{
    const state_param = req.params.state;
    const category_param = req.params.category;
    const title_query = req.query.title;
    const actual_page = parseInt(req.query.page as string);
    const max_price = req.query.max_price as string; // Me certificar de nunca enviar valor nulo
    const min_price = req.query.min_price as string;
    const order = req.query.order as string;
    let order_config : any = {}
    switch(order){
        case 'low-price-first': 
            order_config['price'] = 1;
            break;
        case 'higher-price-first':
            order_config['price'] = -1;
            break;
        case 'most-relevant-first':
            order_config['likes'] = -1;
            break;
        case 'most-recent-first':
            order_config['date_created'] = -1;
    };    
    const skip_items = items_per_page * (actual_page - 1);    
    let price_config : { $gte? : number, $lte? : number } = {};
    min_price? price_config.$gte = parseFloat(min_price) : null;
    max_price? price_config.$lte = parseFloat(max_price) : null;
    const obj = {
        'address.state' : state_param === 'Todos'? null:{$regex : state_param, $options : 'i'},
        'category.name' : { $regex : category_param, $options :'i' },
        title : title_query? {$regex : title_query, $options : 'i'}:null,
        price : Object.values(price_config).length? price_config : null,
    };
    const obj_query = Object.values(obj).reduce((accumulator : any, value, index) => {
        value? accumulator[Object.keys(obj)[index]] = value : null;
        return accumulator;
    }, {});   
        
    const result_query = await ads.find(obj_query).sort(order_config).limit(items_per_page).skip(skip_items);
    res.json( result_query );

};


async function searchSubCategory( req : Request, res : Response)
{
    const state_param = req.params.state;
    const category_param = req.params.category;
    const sub_category_param = req.params.sub_category;
    const title_query = req.query.title;
    const actual_page = parseInt(req.query.page as string);
    const max_price = req.query.max_price as string; // Me certificar de nunca enviar valor nulo
    const min_price = req.query.min_price as string;
    const order = req.query.order as string;
    let order_config : any = {}
    switch(order){
        case 'low-price-first': 
            order_config['price'] = 1;
            break;
        case 'higher-price-first':
            order_config['price'] = -1;
            break;
        case 'most-relevant-first':
            order_config['likes'] = -1;
            break;
        case 'most-recent-first':
            order_config['date_created'] = -1;
    };    
    const skip_items = items_per_page * (actual_page - 1);    
    let price_config : { $gte? : number, $lte? : number } = {};
    min_price? price_config.$gte = parseFloat(min_price) : null;
    max_price? price_config.$lte = parseFloat(max_price) : null;
    const obj = {
        'address.state' : state_param === 'Todos'? null:{$regex: state_param, $options: 'i'},
        'category.sub_category.name': {$regex : sub_category_param, $options: 'i'},
        title : title_query? {$regex: title_query, $options: 'i'}:null,
        price : Object.values(price_config).length? price_config : null,
    };
    const obj_query = Object.values(obj).reduce((accumulator : any, value, index) => {
        value? accumulator[Object.keys(obj)[index]] = value : null;
        return accumulator;
    }, {});      
    const result_query = await ads.find(obj_query).sort(order_config).limit(items_per_page).skip(skip_items);
    res.json( result_query );
};


export default { singleAds, getAllAds, search, searchCategory, searchSubCategory };