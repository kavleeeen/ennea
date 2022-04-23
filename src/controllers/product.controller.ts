import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getModelSchemaRef,
  patch,
  put,
  del,
  requestBody,
  response,
  Request,
} from '@loopback/rest';
import { Product } from '../models';
import { ProductRepository } from '../repositories';
import multer from 'multer'
import moment from 'moment'
import { query } from 'express';
export class ProductController {
  constructor(
    @repository(ProductRepository)
    public productRepository: ProductRepository,
  ) { }

  @post('/products')
  @response(200, {
    description: 'CSV upload',
    content: { 'application/json': { schema: getModelSchemaRef(Product) } },
  })
  async create(
    @requestBody({
      description: 'Product CSV upload',
      required: true,
      content: {
        'multipart/form-data': {
          'x-parser': 'stream',
          schema: { type: 'object' },
        },
      },
    })
    request: Request,
  ): Promise<any> {
    // return this.productRepository.create(product);
    const storage = multer.memoryStorage();
    const upload = multer({ storage });
    return new Promise<object>((resolve, reject) => {
      // @ts-ignore
      upload.any()(request, response, err => {
        if (err) {
          reject(err)
        }
        // @ts-ignore
        const productJson: any = toJSON(request.files[0].buffer.toString())
        this.productRepository.createAll(productJson).catch(err => {
          console.log("error in creating products", err)
        })
        resolve({ message: productJson.length + " products successfully added" })
      });
    })
      .catch(error => {
        console.log({ error })
      });
  }


  @get('/products')
  @response(200, {
    description: 'List of products which are in stock and not expired(default)',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Product, { includeRelations: true }),
        },
      },
    },
  })
  async find(
    @param.query.string('supplier') supplier?: string,
    @param.query.number('offset') offset?: number,
    @param.query.number('limit') limit?: number,
    @param.query.boolean('showExpired') showExpired?: boolean,
  ): Promise<Product[]> {
    const whereObject: any = {
      stock: {
        gt: 0
      },
      supplier: supplier
    }
    if (!showExpired && whereObject) {
      whereObject['exp'] = { gt: moment(new Date()).toString() }
    }
    const filter = {
      where: whereObject,
      limit: limit,
      offset: offset,
      order: ['stock ASC'],
    }
    console.log(filter)
    return this.productRepository.find(filter);
  }
};
const toJSON = (csv: any) => {
  let lines = csv.split('\r\n')
  const result: Product[] = []
  const headers = lines[0].split(',')
  lines.splice(0, 1)

  lines.map((l: any) => {
    const obj: any = {}
    const line = l.split(',')
    headers.map((h: any, i: any) => {
      if (h === "exp") {
        line[i] = moment(line[i]).isValid() ? line[i] : null;
      }
      obj[h] = line[i]

    })
    result.push(new Product(obj))
  })

  return result
}
