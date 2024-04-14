import { ObjectId } from 'mongodb';
import { Schema, model, Model, SchemaType} from 'mongoose';

interface IAddress {
    street: string,
    number: number,
    neighborhood: string,
    zipcode : string,
    city : string,
    state : string,
}

interface ICategory {
    name : string;
    sub_category? : {
        name : string;        
    }
}

export interface IAds {    
    address : IAddress;
    category : ICategory,
    date_created : string,
    description : string,
    id_user_creator : ObjectId,
    likes : number,
    price : number,
    price_negotiable : boolean,
    status : boolean,
    title : string,
    views : number,
    url_image : [string],
};

type AdsModelType = Model<IAds>;

const adsSchema = new Schema<IAds>({    
    address : { 
        street: {type : String},
        number: {type : Number},
        neighborhood: {type : String},
        zipcode : {type : String},
        city : {type : String},
        state : {type : String},
    },
    category : {
        name : {type : String},
        sub_category : {
            name : {type : String},            
        }
    },
    date_created : {type : String},
    description : {type : String},
    id_user_creator : {type : 'ObjectId'},
    likes : {type : Number},
    price : {type : Number},
    price_negotiable : {type : Boolean},
    status : {type : Boolean},
    title : {type : String},
    views : {type : Number},
    url_image : {type : [String]}
});

export default model<IAds, AdsModelType>('ads', adsSchema);

