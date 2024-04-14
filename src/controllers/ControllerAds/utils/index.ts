import { ObjectId } from "mongodb";
import { ITEMS_PER_PAGE } from "../../global-data";
import Ads from "../../../models/Ads";

 export default 
 {  
    queryParamsConfig(state: any, category: any, subCategory: any, userId: any, title: any, priceFilterConfig: any) 
    {
        let obj = { 
            'address.state' : state === 'Todos'? null : {$regex : state, $options : 'i'}, 
            'category.name': category === 'empty'? null : { $regex : category, $options :'i' },
            'category.sub_category.name': subCategory === 'empty'? null : {$regex : subCategory, $options: 'i'},
            id_user_creator: ObjectId.isValid(userId)? ObjectId.createFromHexString(userId) : null, 
            title : title === 'empty'? null : { $regex : title, $options :'i' },
            price : Object.values(priceFilterConfig).filter(price => price).length? priceFilterConfig : null,
        };

        const obj_query = Object.values(obj).reduce((accumulator : any, value, index) => {  
            value? accumulator[Object.keys(obj)[index]] = value : null;       
            return accumulator;
        }, {}); 

        return obj_query;
    },

    priceFilter(maxPrice: string, minPrice: string)
    {
        return {
            $gte: minPrice === 'empty'? null : parseFloat(minPrice as string),        
            $lte: maxPrice === 'empty'? null : parseFloat(maxPrice as string)
        }  
    },

    async query (filteredData: any, sort: any, skipItemsConfig: number): Promise<any>
    {
        const result_query = await Ads.find(filteredData)
        .sort(sort) // A ordem de exebição dos elementos
        .limit(ITEMS_PER_PAGE) // O número de itens por página ou requisição
        .skip(skipItemsConfig)
        return result_query
    }
 }