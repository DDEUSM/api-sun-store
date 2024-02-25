import { Request, Response, NextFunction } from 'express';
import passport from 'passport';
import dotenv from 'dotenv';
import dayjs from 'dayjs';
import { ExtractJwt, Strategy as JWTStrategy } from 'passport-jwt';
import Jwt, { verify } from 'jsonwebtoken';
import users from '../../models/User';
import RefreshToken from '../../models/RefreshToken';
import { ObjectId } from 'mongodb';
import env from '../../env';

dotenv.config();
const notAuthorizedJson = { status : 401, message : 'Not authorized Json token' };

const options = {
    jwtFromRequest : ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey : env.JWT_SECRET as string
};

passport.use(new JWTStrategy(options, async (payload, done) => {
    console.log(payload.id);
    const user = await users.findById(payload.id, '-password_hash'); // '-password_hash para a não capturar a senha do user'
    return user? done(null, user) : done(notAuthorizedJson, false);
}));

export function generateToken(data : Object){
    return Jwt.sign(data, env.JWT_SECRET as string, {
        expiresIn : '40s'
    });
};

export async function generateRefreshToken(id : ObjectId){    
    await RefreshToken.findOneAndDelete({user_id : id});
    const refresh_token = new RefreshToken({
        user_id : id,
        expires_in : dayjs().add(24, 'hour').unix()
    });
    await refresh_token.save();
    await users.findByIdAndUpdate(id, {
        refresh_token
    });
    return refresh_token;
};

export async function generateNewToken( req : Request, res : Response, next: NextFunction )
{
    const notAuthorized = {status: 401, message : 'Invalid refresh token'};
    console.log('refresh_token');
    console.log(req.body);
    if(req.body.refresh_token.length !== 24)
    {
        return next(notAuthorized);
    }
    const current_refresh_token = req.body.refresh_token;
    const refresh_tk = await RefreshToken.findById(current_refresh_token);
    if(refresh_tk)
    {
        const new_token = generateToken({id : refresh_tk.user_id});
        const refresh_token = await generateRefreshToken(refresh_tk.user_id);
        res.json({ new_token, refresh_token : refresh_token._id });        
        return;
    }    
    return next(notAuthorized);  
}

export function privateRoute(req : Request, res : Response, next : NextFunction){
    passport.authenticate('jwt', (err : any, user : any) => {
        req.user = user;
        return user? next():next(notAuthorizedJson);
    })(req, res, next);
};

export default passport;