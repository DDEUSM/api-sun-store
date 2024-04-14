import { NextFunction, Request, Response } from 'express';
import ads from '../../models/Ads';
import { ITEMS_PER_PAGE } from '../global-data';
import utils from './utils/UserAdCount';

async function PandAdsCount(req: Request, res: Response)
{
    const state_param = req.params.state;
    const title_query = req.query.title;
    const max_price = req.query.max_price as string; // Me certificar de nunca enviar valor nulo
    const min_price = req.query.min_price as string;               
    let price_config : { $gte? : number, $lte? : number } = {};
    min_price? price_config.$gte = parseFloat(min_price) : null;
    max_price? price_config.$lte = parseFloat(max_price) : null;
    let obj = { 
        'address.state' : state_param === 'Todos'? '':{$regex : state_param, $options : 'i'}, 
        title : title_query? { $regex : title_query, $options : "i" }:'',
        price : Object.values(price_config).length? price_config : null,
    };    
    const obj_query = Object.values(obj).reduce((accumulator : any, value, index) => {  
        value? accumulator[Object.keys(obj)[index]] = value:null;        
        return accumulator;
    }, {});         
    const count_result = await ads.find(obj_query).count();
    const possible_float = count_result / ITEMS_PER_PAGE;   
    const tot_pages = Number.isInteger(possible_float)? 
    possible_float:Math.floor(possible_float) + 1;
    res.json({ count_items : count_result, tot_pages });
}


async function PandAdsCategoryCount(req: Request, res: Response)
{
    const state_param = req.params.state;
    const category_param = req.params.category;
    const title_query = req.query.title;
    const max_price = req.query.max_price as string; // Me certificar de nunca enviar valor nulo
    const min_price = req.query.min_price as string;               
    let price_config : { $gte? : number, $lte? : number } = {};
    min_price? price_config.$gte = parseFloat(min_price) : null;
    max_price? price_config.$lte = parseFloat(max_price) : null;
    let obj = { 
        'address.state' : state_param === 'Todos'? '':{$regex : state_param, $options : 'i'},
        'category.name' : { $regex : category_param, $options : "i" },
        title : title_query? { $regex : title_query, $options : "i" }:'',
        price : Object.values(price_config).length? price_config : null,
    };    
    const obj_query = Object.values(obj).reduce((accumulator : any, value, index) => {  
        value? accumulator[Object.keys(obj)[index]] = value:null;        
        return accumulator;
    }, {});         
    const count_result = await ads.find(obj_query).count();
    const possible_float = count_result / ITEMS_PER_PAGE;   
    const tot_pages = Number.isInteger(possible_float)? 
    possible_float:Math.floor(possible_float) + 1;
    res.json({ count_items : count_result, tot_pages });    
};


async function PandAdsSubCategoryCount(req: Request, res: Response)
{
    const state_param = req.params.state;
    const sub_category_param = req.params.sub_category;
    const title_query = req.query.title;
    const max_price = req.query.max_price as string; // Me certificar de nunca enviar valor nulo
    const min_price = req.query.min_price as string;               
    let price_config : { $gte? : number, $lte? : number } = {};
    min_price? price_config.$gte = parseFloat(min_price) : null;
    max_price? price_config.$lte = parseFloat(max_price) : null;

    let obj = { 
        'address.state' : state_param === 'Todos'? '':{$regex : state_param, $options : 'i'},
        'category.sub_category.name' : { $regex : sub_category_param, $options : "i" },
        title : title_query? { $regex : title_query, $options : "i" }:'',
        price : Object.values(price_config).length? price_config : null,
    };    
    const obj_query = Object.values(obj).reduce((accumulator : any, value, index) => {  
        value? accumulator[Object.keys(obj)[index]] = value:null;        
        return accumulator;
    }, {});

    const count_result = await ads.find(obj_query).count();
    const possible_float = count_result / ITEMS_PER_PAGE;   
    const tot_pages = Number.isInteger(possible_float)? 
    possible_float:Math.floor(possible_float) + 1;
    res.json({ count_items : count_result, tot_pages });   
}


async function PandUserAdCount( request: Request, response: Response, next: NextFunction )
{
    const {
        state,
        category,
        sub_category
    } = request.params;    
    
    const userId = request.query.userId;
    const title  = request.query.title;        
    const maxPrice = request.query.max_price; // Me certificar de nunca enviar valor nulo
    const minPrice = request.query.min_price;            
    
    const priceFilterConfig = utils.priceFilterConfig(minPrice as string, maxPrice as string);    

    const executeProcess = new Promise((resolve,) => resolve(utils.queryParamsConfig(
        state,
        category, 
        sub_category,
        userId,
        title,
        priceFilterConfig,
    )))

    await executeProcess
    .then( objectQuery => utils.requestDataCount(ITEMS_PER_PAGE, objectQuery))
    .then(resultQuery => response.json(resultQuery))
    .catch(error => {
        const errorReason: string = error.toString().slice(6);  
        const errorReasonJson = JSON.parse(errorReason);
        next(errorReasonJson);
    });        
}

export default { PandAdsCount, PandAdsCategoryCount, PandAdsSubCategoryCount, PandUserAdCount };