import { NextFunction, Request, Response } from 'express';
import { generateRefreshToken, generateToken } from '../config/passport';
import bcrypt from 'bcrypt';
import users from '../models/User';
import User from '../models/User';

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
    console.log(req.body)
    if((Object.values(req.body).includes(undefined || '')) || (Object.values(req.body).length !== 5)){
        res.status(422).json({ error_message : 'Preencha todos os campos!' });
        return;
    }
    const { 
        name, 
        email, 
        password,
        confirmPassword,
        state, 
    } = req.body;

    let capital_name : string = name.toLowerCase().split(' ').map((word : string) => {
        let new_word = word[0].toUpperCase() + word.substring(1);
        return new_word;
    }).toString().replaceAll(',',' ');
    let email_lower_case = email.toLowerCase();

    const this_user_exists = await users.findOne({
        name : capital_name,
        email : email_lower_case
    });
    if(this_user_exists){
        res.status(422).json({ 
            error_message : 'Este email já foi cadastrado.', 
            field : 'email'
        });
        return;
    }
    const salt = await bcrypt.genSalt(12);
    const password_hash = await bcrypt.hash(password, salt);
    const new_user = new users({
        name : capital_name,
        email : email_lower_case,
        password_hash,
        state
    });
    await new_user.save();
    res.json({ message_sucess : 'Conta registrada com êxito.' });        
    return;
};

async function userLogin( req: Request, res: Response, next: NextFunction ){
    const { email, password } = req.body;
    console.log(email, password);
    const email_lower_case = email.toLowerCase();
    const user_result = await users.findOne({
       email : email_lower_case   
    }); 
    if(!user_result){
        const notAuthorized = { status: 422, message: "Senha ou Email incorreto!" };       
        return next(notAuthorized);
    }
    const check_password = await bcrypt.compare(password, user_result.password_hash);
    if(!check_password){
        const notAuthorized = { status: 422, message: "Senha ou Email incorreto!" };       
        return next(notAuthorized);
    }
    const token = generateToken({ id : user_result._id });
    if(!user_result.refresh_token){
        const created_refresh_token = await generateRefreshToken(user_result._id);
        res.json({ message_sucess : 'token', token, refresh_token : created_refresh_token });   
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

function uploadProfileImage(req: Request, res: Response){
    res.json({ file : req.file });
}

export default { getAllUsers, getUser, createNewUser, userLogin, uploadProfileImage };