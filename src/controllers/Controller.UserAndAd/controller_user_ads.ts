import { NextFunction, Request, Response } from 'express';
import Ads, { IAds } from '../../models/Ads';
import User from '../../models/User';
import Views from '../../models/Views';
import mongoose from 'mongoose';
import { ObjectId } from 'mongodb';
import FavoriteOrDesfavoriteMethods from './FunctionModules/FavoriteOrDesfavoriteAd';
import { verify } from 'jsonwebtoken';
import VisualizeAdMethods from './FunctionModules/VisualizeAdMethod';


async function userAds(request: Request, response: Response, next: NextFunction)
{
    const { userId } = request.body;
    await Ads.find({ id_user_creator: userId })
        .then(Ads => {
            Ads.length? 
            response.json(Ads)
            : 
            response.status(404).json("Nenhum recurso foi encontrado");
        })             
        .catch (error => {    
            console.log(error);
            const errorReason = {status: 500, message: 'Ocorreu algun erro no servidor.'};
            next(errorReason);            
        });           
    return;
}


async function newAds( req: Request, res: Response, next: NextFunction )
{
    const ads_data : IAds  = req.body;    
    const new_user = new Ads(ads_data);
    await new_user.save()
    .then(() => res.status(201).json({ message : 'Novo anúncio criado!'}))
    .catch(error => {
        console.log(error)
        const errorReason = {status: 500, message : 'Ocorreu algun erro no servidor.'};
        next(errorReason);
    })
    return;
}


async function editAds(req : Request, res : Response, next: NextFunction)
{
    const { adId, body }: any = req.body;    
    await Ads.findByIdAndUpdate(adId, body)
    .then(() => res.json('O anúncio foi editado com sucesso')) 
    .catch(error => {
        console.log(error);
        const errorReason = {status: 500, message : 'Ocorreu algum erro no servidor.'};
        next(errorReason);
    }); 
    return;
}


async function deleteAds(req: Request, res: Response, next: NextFunction)
{
    const { ads_id } = req.body;    
    await Ads.findByIdAndDelete(ads_id)
    .then(() => res.json({ message: 'Anúncio deletado com sucesso' }))
    .catch(error => {
        console.log(error);
        const errorReason = {status: 500, message : 'Ocorreu algum erro no servidor.'};
        next(errorReason);
    }) 
    return;   
}


async function favoriteOrDesfavoriteAd(request: Request, response: Response, next: NextFunction)
{                   
    const executeProcess = new Promise((resolve, ) => resolve(request.body));
    await executeProcess
        .then(userAndAdIds => FavoriteOrDesfavoriteMethods.checkIfTheIdsAreValid(userAndAdIds))
        .then(userAndAdIds => FavoriteOrDesfavoriteMethods.checkIfTheUserHasLikedBefore(userAndAdIds))
        .then(({ thisUser, thisAd, userHasLikedBefore }) => 
            userHasLikedBefore? 
            FavoriteOrDesfavoriteMethods.deslikeAd({thisUser, thisAd}) 
            : 
            FavoriteOrDesfavoriteMethods.favoriteAd({thisUser, thisAd})
        ) 
        .then(message => response.json(message))
        .catch((err: any) => {  
            console.log(err)    
            const errorReason: string = err.toString().slice(6);  
            const errorReasonJson = JSON.parse(errorReason);
            next(errorReasonJson);
        });    
}   


async function visuazileAds(request: Request, response: Response, next: NextFunction)
{
    const functionExecute = new Promise((resolve, ) => resolve(request.body));
    await functionExecute
        .then(userAndAdIds => VisualizeAdMethods.checkIfTheIdsAreValid(userAndAdIds))
        .then(userAndAdIds => VisualizeAdMethods.checkIfTheUserHasAlreadyViewed(userAndAdIds))
        .then(userAndAdIds => VisualizeAdMethods.generateANewView(userAndAdIds))
        .then(message => response.json(message))
        .catch((err: any) => {      
            const errorReason: string = err.toString().slice(6);  
            const errorReasonJson = JSON.parse(errorReason);
            next(errorReasonJson);
        });                
}

function uploadProductImages(req: Request, res: Response){
    res.json({ message : 'Imagem armazenada' });
}

async function myFavoritesAds(request: Request, response: Response, next: NextFunction)
{
    const { userId, adId } = request.body;
    const thisUserContainsThisAd = await User.findById(userId)
        .then(thisUser => {
            return thisUser?.favorite_ads.includes(adId)?
            true : false            
        })        
        .catch(error => {
            console.log(error);
        })
    if(thisUserContainsThisAd){
        await Ads.findById(adId)
            .then(thisAd => response.json(thisAd))
            .catch(error => console.log(error)) 
        return;       
    }    
    response.json("este usuário não favoritou este anúncio")
    return;
    
}

export default { userAds, newAds, editAds, deleteAds, favoriteOrDesfavoriteAd, visuazileAds, uploadProductImages };