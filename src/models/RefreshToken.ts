import { ObjectId } from "mongodb";
import { Schema, model } from "mongoose";

interface IRefreshToken {
    user_id : ObjectId;
    expires_in : number;
};

const RefreshTokenSchema = new Schema<IRefreshToken>({
    user_id : { type : "ObjectID" },
    expires_in : { type : Number }
});

export default model<IRefreshToken>('refreshtoken', RefreshTokenSchema );