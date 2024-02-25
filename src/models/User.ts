import { ObjectId } from "mongodb";
import { Schema, model } from "mongoose";

interface Iuser {
    name : string;
    email : string;
    birth : string;
    cpf: string;
    sex: "masculino" | "feminino";
    password_hash : string;
    refresh_token? : ObjectId; 
    state : string;
    favorite_ads : [ ObjectId ];
    profile_img : string;
};

const UserSchema = new Schema<Iuser>({
    name : { type : String },
    email : { type : String },
    birth : { type : String },
    cpf: { type: String},
    sex: { type: String },
    password_hash : { type : String },
    refresh_token : { type : ObjectId },
    state : { type : String },
    favorite_ads : { type : [ObjectId] },
    profile_img : { type : String },
});

export default model<Iuser>('users', UserSchema);