import { NextFunction } from "express";
import { ObjectId } from "mongodb";
import User from "../../../models/User";
import Ads from "../../../models/Ads";

export default
{
   
    checkIfTheIdsAreValid : (body: any) => {
        console.log(body.userId.length)
        if((body.adId.length < 24) || (body.userId.length < 24 ))
        {
            const paramError = { status : 422, message : "Está faltando algum parâmetro." }
            throw new Error(JSON.stringify(paramError));                
        }
        const userId = ObjectId.createFromHexString(body.userId);
        const adId = ObjectId.createFromHexString(body.adId);            
        return { userId, adId };
    },
    
    checkIfTheUserHasLikedBefore : async(ids: any) => {                                
        try 
        {
            const requests = await Promise.all([
                User.findById(ids.userId),
                Ads.findById(ids.adId),
            ]);         
            const[thisUser, thisAd] = requests;
            if(!(thisUser && thisAd))
            {
                const notAuthorized = { status: 422, message: "Algum parâmetro errado."}
                throw new Error(JSON.stringify(notAuthorized));                    
            }                               
            if(thisUser.favorite_ads.includes(ids.adId))
            {
                return {thisUser, thisAd, userHasLikedBefore: true};                    
            }
            return {thisUser, thisAd, userHasLikedBefore: false};
        } 
        catch (error) 
        {                        
            const serverError = { status: 500, message: "Ocorreu algum erro no servidor."}
            throw new Error(JSON.stringify(serverError));
        }           
    },

    favoriteAd : async({thisUser, thisAd }: any) => {
        try 
        {                
            if(thisUser.favorite_ads){
                thisUser.favorite_ads.push(thisAd);
                await thisUser.save();
                await thisAd.updateOne({$inc : {'likes' : 1}});                         
                return "Anúncio favoritado";
            }
            return "";
        } 
        catch (error)             
        {                         
            const serverError = { status: 500, message: "Ocorreu algum erro no servidor."}
            throw new Error(JSON.stringify(serverError));
        }
    },

    deslikeAd : async({thisUser, thisAd }: any) => {           
        try
        {
            let FindIndex = thisUser.favorite_ads.findIndex((item: any) => item._id === thisAd._id);
            if(FindIndex < 0)
            {
                return;
            }
            thisUser.favorite_ads.splice(FindIndex, 1);
            await thisUser.save();       
            await thisAd.updateOne({$inc : {"likes": -1}});
            return "Anúncio desfavoritado";     
        }
        catch (error) 
        {                            
            const serverError = { status: 500, message: "Ocorreu algum erro no servidor."}
            throw new Error(JSON.stringify(serverError));
        }
    } 
    
}