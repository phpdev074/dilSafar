import {Router} from "express"
import { createPost, deletePost, getAllPost, getListPost, getPollDetails, getPostByUserId, getPostDetails, getProfileData, pollingVote, postListing, updatePost, VotePollesNew } from "../../controller/postController.js";
import { authJwt } from "../../middlewares/authjwt.js";

const router = Router();

router.route('/').post(createPost).get(getPostDetails).put(updatePost).delete(deletePost)
router.route('/getPostByUserId').get(getPostByUserId)
router.route('/getAllPost').get(getAllPost)


router.route('/vote/:pollId').post(pollingVote)
router.route('/getPollDetails/:pollId').get(getPollDetails)
router.route('/votePolles/:pollId').post(VotePollesNew)
router.route('/postListing').get(authJwt,postListing)
router.route('/getProfileData').get(authJwt,getProfileData)

export default router;

