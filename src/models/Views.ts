import { ObjectId } from "mongodb";
import { Schema, model } from "mongoose";

interface IView {
    userId : ObjectId;
    adId : ObjectId;
};
const ViewSchema = new Schema<IView>({
    userId : ObjectId,
    adId : ObjectId
});

export default model<IView>("views", ViewSchema);