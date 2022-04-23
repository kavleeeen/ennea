import { Entity, model, property } from '@loopback/repository';

@model({ settings: { strict: false } })
export class Product extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'string',
  })
  name?: string;

  @property({
    type: 'string',
  })
  code?: string;

  @property({
    type: 'string',
  })
  batch?: string;

  @property({
    type: 'number',
  })
  stock?: number;

  @property({
    type: 'string',
  })
  deal?: string;

  @property({
    type: 'boolean',
  })
  free?: boolean;

  @property({
    type: 'string',
  })
  mrp?: string;

  @property({
    type: 'date',
  })
  exp?: string;
  @property({
    type: 'string',
  })
  company?: string;

  @property({
    type: 'string',
  })
  supplier?: string;


  @property({
    type: 'string',
  })
  rate?: string;


  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<Product>) {
    super(data);
  }
}

export interface ProductRelations {
  // describe navigational properties here
}

export type ProductWithRelations = Product & ProductRelations;
