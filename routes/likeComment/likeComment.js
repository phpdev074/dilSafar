import { Router } from "express";
import { commentCreate, getComments, getListPostLike, LikeCreate } from "../../controller/likeCommentController.js";
import { authJwt } from "../../middlewares/authjwt.js";

const router = Router();

router.route('/like').post(authJwt,LikeCreate).get(authJwt,getListPostLike)
router.route('/comment').post(authJwt,commentCreate).get(authJwt,getListPostLike)
router.route('/getComments').get(authJwt,getComments)


export default router;