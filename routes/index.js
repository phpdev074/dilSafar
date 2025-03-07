import { Router } from "express";
import auth from './auth/auth.js';
import fileUpload from './files/fileUplaod.js'
import categoryRoute from './category/categoryRoute.js'
import productRoutes from "./product/product.js";
import postRoutes from './postRoutes/post.js'
import pageRoutes from './page/page.js'
import faqRoutes from './FAQ/faq.js'
import contact_usRouter from './contactUs/contactUs.js'
import adminRoutes from './admin/admin.js'


const router = Router();

const apiRouter = Router();
apiRouter.use('/', auth);
apiRouter.use('/category',categoryRoute)
apiRouter.use('/product',productRoutes)
apiRouter.use('/post',postRoutes)
apiRouter.use('/pages',pageRoutes)
apiRouter.use('/FAQ',faqRoutes)
apiRouter.use('/contact_us',contact_usRouter)

router.use('/admin',adminRoutes)
router.use('/api', apiRouter);
router.use('/fileUpload',fileUpload)
export default router;
