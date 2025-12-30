import { ProductType } from '../../models/models';

export type Method = 'POST' | 'PUT';

export type GenericObject = {
  [key: string]: any;
};

export type MutationUpdateFunction = (
  id: number,
  payload: ProductType,
  query: string[],
) => Promise<any>;

export type MutationCreateFunction = (
  payload: ProductType,
  query: string[],
) => Promise<any>;

export type DeleteFunction = (url: string, token?: string) => Promise<any>;

export type GetListFunction = (
  url: string,
  token?: string,
) => Promise<GenericObject[]>;

export type QueryFunction = (
  url: string,
  token?: string,
) => Promise<GenericObject>;
