import { ProductType } from '../models/models';

export type Method = 'POST' | 'PUT';

export type GenericObject = {
  [key: string]: any;
};

export type MutationFunction = (
  payload: GenericObject,
  url: string,
  method: Method,
  token?: string,
) => Promise<any>;

export type DeleteFunction = (url: string, token?: string) => Promise<any>;

export type GetListFunction = () => Promise<ProductType[]>;

export type QueryFunction = (id: number) => Promise<ProductType>;
export type ProductI = ProductType;

export type ServerActionsMutation = () => Promise<any>;
export type BulkCreateProductMutation = (data: ProductType[]) => Promise<any>;
export type CreateNextInventoryMutation = (seller: string) => Promise<any>;
