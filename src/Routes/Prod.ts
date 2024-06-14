import {Router} from 'express'
import {GetProducts,AddProduct,SearchProduct,priceProduct} from "../controllers/prod"


const ProductRouter = Router()

ProductRouter.get("",GetProducts )

ProductRouter.post("",AddProduct )


ProductRouter.get("/:Id", priceProduct)

ProductRouter.get("/:Name",SearchProduct )



export default ProductRouter;
