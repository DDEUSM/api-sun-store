import mongoose from "mongoose";
import Views from "../../../models/Views";
import Ads from "../../../models/Ads";

export default 
{
    checkIfTheIdsAreValid : ({ userId, adId }: any) => {
        if(!(mongoose.isObjectIdOrHexString(userId)))
        {
            const paramError = { status: 422, message: "Algum parâmetro incorreto"}
            throw new Error(JSON.stringify(paramError));
        }
        return { userId, adId } 
    },

    checkIfTheUserHasAlreadyViewed : async({ userId, adId }: any) => {
        const userAndAdExists = await Views.findOne({
            userId,
            adId 
        }).catch((error) => {
            console.log(error);
            const serverError = { status: 500, message: "Ocorreu algum erro no servidor."}
            throw new Error(JSON.stringify(serverError));
        });    
                        
        if(userAndAdExists)
        {
            console.log("Este usuário já visualizou este anúncio");
            const errorReason = {
                status: 200, 
                message: `O Anúncio ${userAndAdExists.adId} já foi visualizado pelo usuário ${userAndAdExists.userId}`,                
            };                 
            throw new Error(JSON.stringify(errorReason));          
        }
        return { userId, adId }
    },

    generateANewView : async({ userId, adId }: any) => {
        try {
            await Ads.findByIdAndUpdate(adId, {$inc: {"views": 1}})
            const newVisualization = new Views({
                userId,
                adId
            });
            await newVisualization.save();
            return "O anúncio foi visualizado com sucesso."
        } catch (error) {
            const errorReason = {
                status: 500, 
                message: "Ocorreu algum erro no servidor",                
            };                 
            throw new Error(JSON.stringify(errorReason));
        };        
    }
}