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
            'address.state' : state === 'Todos'? null : {$regex : state, $options : 'i'}, 
            'category.name': category === 'empty'? null : { $regex : category, $options :'i' },
            'category.sub_category.name': subCategory === 'empty'? null : {$regex : subCategory, $options: 'i'},
            id_user_creator: ObjectId.isValid(userId)? ObjectId.createFromHexString(userId) : null, 
            title : title === 'empty'? null : { $regex : title, $options :'i' },
            price : Object.values(priceFilterConfig).length? priceFilterConfig : null,
        };
        const obj_query = Object.values(obj).reduce((accumulator : any, value, index) => {  
            value? accumulator[Object.keys(obj)[index]] = value:null;       
            return accumulator;
        }, {}); 
        return obj_query;
    },

    skipItemsConfig: (itemsPerPage: any, pageQuery: any) => {
        return itemsPerPage * (pageQuery - 1);
    },

    requestData: async(order_config: any, items_per_page: any, skip_items: any, obj_query: any) => {        
        const result_query = await Ads.find(obj_query)
        .sort(order_config) // A ordem de exebição dos elementos
        .limit(items_per_page) // O número de itens por página ou requisição
        .skip(skip_items)
        .catch(error => {
            const serverError = { status: 500, message: "Ocorreu algum erro no servidor."}
            throw new Error(JSON.stringify(serverError));
        }); // O número de itens que serão pulados, que faz parte da paginação    
        return result_query
    }

 }