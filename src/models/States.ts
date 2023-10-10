import { Schema, model } from "mongoose";

interface IState {
    name : string;
    acronym : string;
};

const state_schema = new Schema<IState>({
    name : { type : String },
    acronym : { type : String }
});

export default model<IState>('states', state_schema);

