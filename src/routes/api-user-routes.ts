import { Router } from 'express';
import controller_user from '../controllers/controller-user';
import controller_user_ads from '../controllers/Controller.UserAndAd/controller_user_ads';
import controller_ads from '../controllers/ControllerAds';
import { generateNewToken, privateRoute } from '../controllers/config/passport';
import { upload } from '../controllers/config/upload_multer';


const inputPath = "./public/temp-images/*.{jpg,JPG,jpeg,JPEG}";
const outputPath = "./public/images";

const userRoutes = Router();

userRoutes.get('/user/all', privateRoute, controller_user.getAllUsers);
userRoutes.get('/user/:id', controller_user.getUser);
userRoutes.post('/user/register', controller_user.createNewUser);
userRoutes.post('/user/login', controller_user.userLogin);
userRoutes.post('/refresh-token', generateNewToken);

// User Ads
userRoutes.post('/user/new-ads' ,controller_user_ads.newAds );
userRoutes.post('/user/edit-ads' ,controller_user_ads.editAds );
userRoutes.post('/user/all-user-ads' ,controller_user_ads.userAds );
userRoutes.delete('/user/delete-ads' ,controller_user_ads.newAds );

userRoutes.post('/user/visualize-ad', controller_user_ads.visuazileAds );
userRoutes.get("/search/:state", controller_ads.search);
userRoutes.get("/search/:state/:category", controller_ads.searchCategory);
userRoutes.get("/search/:state/:category/:sub_category", controller_ads.searchSubCategory);

userRoutes.post('/user/favorite-or-desfavorite-ad', controller_user_ads.favoriteOrDesfavoriteAd );

userRoutes.post('/user/upload-profile-image/:id', upload.single("profile_image"), controller_user.uploadProfileImage);


export default userRoutes;