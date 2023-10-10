import { Router, Response, Request } from "express";
import controller_ads from '../controllers/ControllerAds';
import controller_states from '../controllers/controllers-states';
import controller_categories from '../controllers/controller-categories';
import controller_count_results from '../controllers/ControllerResultCount';

const routes = Router();

routes.get("/all", controller_ads.getAllAds);
routes.get("/ads/:id", controller_ads.singleAds);
routes.get("/search/:state/:category/:sub_category", controller_ads.search);
//routes.get("/search/:state/:category", controller_ads.searchCategory);
//routes.get("/search/:state/:category/:sub_category", controller_ads.searchSubCategory);


routes.get("/count/:state", controller_count_results.PandAdsCount);
routes.get("/count/:state/:category", controller_count_results.PandAdsCategoryCount);
routes.get("/count/:state/:category/:sub_category", controller_count_results.PandAdsSubCategoryCount);

// State routes

routes.get("/all-states", controller_states.getAllStates );
routes.get("/all-categories", controller_categories.getAllCategories);
//routes.get('/', controller.searchInCategory );

//routes.put('/editAdvisor/')
//routes.delete('/deleteAdvisor')

export default routes;