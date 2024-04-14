import { ObjectId } from "mongodb";
import { IAds } from "../../models/Ads";
import { adaptDateToDatabase, capitalizeWords } from "../../utils";

export function adAdapterToDb(adData: any)
{
    return {
        address: adData.address,
        category: adData.category,
        date_created: adaptDateToDatabase(new Date()),
        description: adData.description,
        id_user_creator: new ObjectId(adData.id_user_creator),
        likes : 0,
        price : parseFloat(adData.price),
        price_negotiable : Boolean(adData.price_negotiable),
        status : true,
        title : capitalizeWords(adData.title),
        views : 0,
        url_image : [adData.url_image]
    } as IAds
}