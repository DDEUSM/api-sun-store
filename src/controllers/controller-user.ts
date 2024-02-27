import { NextFunction, Request, Response } from 'express';
import { generateRefreshToken, generateToken } from './config/passport';
import bcrypt from 'bcrypt';
import users from '../models/User';
import User from '../models/User';
import { adaptDateToDatabase, capitalizeWords } from '../utils';
import mongoose from 'mongoose';
import { ObjectId } from 'mongodb';
import env from '../env';
import { compressImages } from './config/imageCompressor';

async function getAllUsers( req : Request, res : Response )
{        
    const user_result = await users.find({});
    res.json(user_result);
};

async function getUser( req : Request, res : Response )
{
    const user = await User.findById(req.params.id as string, "-password_hash");
    res.json(user);
};

async function createNewUser( req : Request, res : Response )
{       
    if((Object.values(req.body).includes(undefined || '')) || (Object.values(req.body).length !== 8)){
        res.status(422).json({ error_message : 'Preencha todos os campos!' });
        return;
    }    
    console.log(req.body)

    const { 
        name, 
        email,
        birth,
        cpf,
        sex, 
        password, 
        confirmPassword,       
        state, 
    } = req.body;

    let capital_name = capitalizeWords(name);
    let email_lower_case = email.toLowerCase();

    const user_already_exists = await users.findOne({
        name : capital_name,
        email : email_lower_case
    });

    if(user_already_exists)
    {
        res.status(422).json({ 
            error_message : 'Este email já foi cadastrado.', 
            field : 'email'
        });
        return;
    }

    console.log(adaptDateToDatabase(birth))

    const salt = await bcrypt.genSalt(12);
    const password_hash = await bcrypt.hash(password, salt);
    const new_user = new users({
        name : capital_name,
        birth: adaptDateToDatabase(birth),
        cpf,
        sex,
        email : email_lower_case,
        password_hash,
        state
    });

    new_user._id = new ObjectId()

    console.log(new_user)

    await new_user.save();    
    
    res.json({ id: new_user._id });        
    return;
};


async function userLogin( req: Request, res: Response, next: NextFunction )
{
    const { email, password } = req.body;    

    const email_lower_case = email.toLowerCase();

    const user_result = await users.findOne({
       email : email_lower_case   
    }); 

    if(!user_result)
    {
        const notAuthorized = { status: 422, message: "Senha ou Email incorreto!" };       
        return next(notAuthorized);
    }
    const check_password = await bcrypt.compare(password, user_result.password_hash);
    if(!check_password)
    {
        const notAuthorized = { status: 422, message: "Senha ou Email incorreto!" };       
        return next(notAuthorized);
    }
    const token = generateToken({ id : user_result._id });
    if(!user_result.refresh_token)
    {
        const created_refresh_token = await generateRefreshToken(user_result._id); 
        //res.json({ message_sucess : 'token', token, refresh_token : created_refresh_token });   
    }
    res.json({
        id : user_result._id, 
        name : user_result.name, 
        email : user_result.email, 
        profile_img : user_result.profile_img,
        token, 
        refresh_token : user_result.refresh_token, 
    });
    return;
};

async function logOut(req: Request, res: Response){    
    res.json({});
}

async function uploadProfileImage(req: Request, res: Response)
{
    const { file } = req;
    const { id } = req.params;
    
    const inputPath = "public/temp-images/"+file?.filename;
    const outputPath = "public/images/users/"; 
    const rawName = file?.filename.split(".")[0] as string;    

    const finalImageUrl = compressImages(inputPath, outputPath, rawName);

    const formatedUrl = (finalImageUrl.replaceAll("/", "\\")).replace("public\\", "")
    await User.findByIdAndUpdate(id, { profile_img: `http://${env.ADDRESS}:${env.PORT}\\${formatedUrl}`})
}

export default { getAllUsers, getUser, createNewUser, userLogin, uploadProfileImage };