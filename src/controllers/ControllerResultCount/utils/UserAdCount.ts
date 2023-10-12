import { ObjectId } from "mongodb";
import Ads from "../../../models/Ads";

export default
{
     sortConfig: ( order = 'most-relevant-first' ) => { // Não pode receber um undefined
        let orderConfig: any = {};
        switch(order){
            case 'low-price-first': 
                orderConfig['price'] = 1;
                break;
            case 'higher-price-first':
                orderConfig['price'] = -1;
                break;
            case 'most-relevant-first':
                orderConfig['likes'] = -1;
                break;
            case 'most-recent-first':
                orderConfig['date_created'] = -1;
            default:
                orderConfig['likes'] = -1;
                break;
        };
        return orderConfig;
    },

    priceFilterConfig: (minPrice: string, maxPrice: string) => {
        let priceFilterConfig : { $gte? : number, $lte? : number } = {};
        minPrice === 'empty'? null : priceFilterConfig.$gte = parseFloat(minPrice as string);
        maxPrice === 'empty'? null : priceFilterConfig.$lte = parseFloat(maxPrice as string);
        return priceFilterConfig
    },

    queryParamsConfig: (state: any, category: any, subCategory: any, userId: any, title: any, priceFilterConfig: any) => {
        let obj = { 
            'address.state' : state === 'Todos'? '':{$regex : state, $options : 'i'}, 
            'category.name': category === 'empty'? null : { $regex : category, $options :'i' },
            'category.sub_category.name': subCategory === 'empty'? null : {$regex : subCategory, $options: 'i'},
            id_user_creator: ObjectId.isValid(userId)? ObjectId.createFromHexString(userId) : "", 
            title : title === 'empty'? null : { $regex : title, $options :'i' },
            price : Object.values(priceFilterConfig).length? priceFilterConfig: null,
        };
        const obj_query = Object.values(obj).reduce((accumulator : any, value, index) => {  
            value? 
                accumulator[Object.keys(obj)[index]] = value 
                : 
                null;       
            return accumulator;
        }, {}); 
        return obj_query;
    },

    requestDataCount: async(items_per_page: any,obj_query: any) => {        
        const resultCount = await Ads.find(obj_query)
        .count()
        .catch(error => {
            const serverError = { status: 500, message: "Ocorreu algum erro no servidor."}
            throw new Error(JSON.stringify(serverError));
        }); // O número de itens que serão pulados, que faz parte da paginação    

        let pagesNumber = resultCount / items_per_page;        
        pagesNumber = Number.isInteger(pagesNumber)? 
            pagesNumber 
        : 
            Math.floor(pagesNumber) + 1;

        return { count_items: resultCount, tot_pages: pagesNumber }
    }
}