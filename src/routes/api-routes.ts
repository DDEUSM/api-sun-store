import { Router, Response, Request } from "express";
import controller_ads from '../controllers/ControllerAds';
import controller_states from '../controllers/controllers-states';
import controller_categories from '../controllers/controller-categories';
import controller_count_results from '../controllers/ControllerResultCount';
import { upload } from "../controllers/config/upload_multer";
import multer from "multer";

const routes = Router();

routes.get("/all", controller_ads.getAllAds);
routes.get("/ad/:id", controller_ads.singleAds);
routes.post("/ad", upload.single("product_image"), controller_ads.createAd);
routes.get("/search/:state/:category/:sub_category", controller_ads.search);
routes.get("/count/:state/:category/:sub_category", controller_count_results.PandUserAdCount);
routes.get("/all-states", controller_states.getAllStates );
routes.get("/all-categories", controller_categories.getAllCategories);


routes.post("/upload-image-test", multer().single("image"), controller_ads.uploadImagetest)

export default routes;