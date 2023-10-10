import { model, Schema, Model, isValidObjectId } from "mongoose";

type CategoryType = {    
    name : string;
    sub_types? : CategoryType[];
    color? : string;
    category_icon? : string;
    filters? : string;
}


type CategoryModelType = Model<CategoryType>;

const CategorySchema = new Schema<CategoryType>({    
    name : {type : String},
    sub_types : {type : Object},
    color : {type : String},
    category_icon : {type : String},
    filters : {type : String}
})

export default model<CategoryType, CategoryModelType>("categories", CategorySchema);