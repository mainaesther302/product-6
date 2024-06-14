
import {Request } from 'express'

export interface Product{
    Id: string,
    Name: string,
  
    Price: number,
    
}
interface AddProduct{
    Name: string,
    
    Price: number,
    
}

 interface RequestParams {
    page: string;
    limit: string;
  }
export interface PriceProductRequestParams extends RequestParams {
    min_Price: string;
    max_Price: string;
    Name: string;
  }
  
  type PriceProductRequest<T = PriceProductRequestParams> = Request<T>;
  
export interface ProductRequest extends Request{
    body: AddProduct
}