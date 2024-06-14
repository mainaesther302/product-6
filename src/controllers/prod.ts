import { Request, Response, RequestHandler } from 'express';
import { v4 as uuid } from 'uuid';
import { sqlConfig } from '../config/prod';
import mssql from 'mssql';
import { ProductRequest, Product, PriceProductRequestParams } from '../Models/prod';

//******************************ADD PRODUCT************************* */
export const AddProduct: RequestHandler = async (req: ProductRequest, res: Response) => {
    try {
      const Id = uuid();
      const { Name, Price } = req.body;
      const pool = await mssql.connect(sqlConfig);
  
      await pool.request()
        .input('Id', mssql.VarChar, Id)
        .input('Name', mssql.VarChar, Name)
        .input('Price', mssql.VarChar, Price)
        .execute('addProduct');
  
      res.status(201).json({ message: 'Product added successfully' });
    } catch (error:any) {
      res.status(500).json({ error: error.message });
    }
  };

//****************************Get products*********************** */
export const GetProducts: RequestHandler = async (req: ProductRequest, res: Response) => {
    try {
      const pool = await mssql.connect(sqlConfig);
      const result = await pool.request().execute('getProducts');
      const products = result.recordset as Product[];
      res.status(200).json(products);
    } catch (error:any) {
      res.status(500).json({ error: error.message });
    }
  };
  
//****************************Get product*********************** */

// export const GetProduct: RequestHandler = async (req: Request<{ Id: string }>, res: Response) => {
//   try {
//     const pool = await mssql.connect(sqlConfig);
//     const result = await pool.request()
//       .input('Id', mssql.VarChar, req.params.Id) // Correct the input type to match your DB schema
//       .execute('getProduct');

//     const product = result.recordset[0] as Product;

//     if (product) {
//       res.status(200).json(product);
//     } else {
//       res.status(404).json({ message: 'Product not found' });
//     }

//   } catch (error: any) {
//     res.status(500).json({ error: error.message });
//   }
// };

//****************************Search for product********************* */
export const SearchProduct: RequestHandler = async (req: ProductRequest, res: Response) => {
    try {
        const pool = await mssql.connect(sqlConfig);
        const result=await pool.request()
        .input('Name', mssql.VarChar, req.params.Name)
        .execute('searchProduct');
        const product = result.recordset[0] as Product;
        if (product) {
          res.status(200).json(product);
        } else {
          res.status(404).json({ message: 'Product not found' });
        }
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
         
}
//***********************ENDPOINT TO RETURN A PAGINATED LIST OF PRODUCTS****************** */
 

export const pageProduct: RequestHandler = async (req: ProductRequest, res: Response) => {
  const { Id, Name, PageNumber, PageSize } = req.params;
  const pageNumber = parseInt(PageNumber);
  const pageSize = parseInt(PageSize);

  try {
    const pool = await mssql.connect(sqlConfig);
    const result = await pool.request()
      .input('Id', mssql.VarChar, Id)
      .input('Name', mssql.VarChar, Name)
      .input('PageNumber', mssql.Int, pageNumber)
      .input('PageSize', mssql.Int, pageSize)
      .execute('pageProduct');

    const products = result.recordset as Product[];

    if (products.length > 0) {
      res.status(200).json(products);
    } else {
      res.status(404).json({ message: 'Products not found' });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
//***********************************products based on price ************************* */


export const priceProduct: RequestHandler = async (req: PriceProductRequestParams, res: Response) => {
  const { min_Price, max_Price, Name } = req.params;
  const minPrice = parseInt(min_Price);
  const maxPrice = parseInt(max_Price);

  try {
    const pool = await mssql.connect(sqlConfig);
    const result = await pool.request()
      .input('min_Price', mssql.Int, minPrice)
      .input('max_Price', mssql.Int, maxPrice)
      .input('Name', mssql.VarChar, Name)
      .execute('priceProduct');

    const products = result.recordset as Product[];

    if (products.length > 0) {
      res.status(200).json(products);
    } else {
      res.status(404).json({ message: 'No products found within the specified price range' });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};