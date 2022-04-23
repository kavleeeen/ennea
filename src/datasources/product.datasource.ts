import { inject, lifeCycleObserver, LifeCycleObserver } from '@loopback/core';
import { juggler } from '@loopback/repository';

const config = {
  name: 'product',
  connector: 'postgresql',
  url: 'postgres://nblpljgtbcicrv:053004c58a31d845eae7103c4b19e1f64400a2dc57ee537f8b3ae67b086533ea@ec2-3-218-171-44.compute-1.amazonaws.com:5432/dap1q4310542dm',
  host: 'ec2-3-218-171-44.compute-1.amazonaws.com',
  port: 5432,
  user: 'nblpljgtbcicrv',
  password: '053004c58a31d845eae7103c4b19e1f64400a2dc57ee537f8b3ae67b086533ea',
  database: 'dap1q4310542dm',
  ssl: {
    rejectUnauthorized: false,
  },
};

// Observe application's life cycle to disconnect the datasource when
// application is stopped. This allows the application to be shut down
// gracefully. The `stop()` method is inherited from `juggler.DataSource`.
// Learn more at https://loopback.io/doc/en/lb4/Life-cycle.html
@lifeCycleObserver('datasource')
export class ProductDataSource extends juggler.DataSource
  implements LifeCycleObserver {
  static dataSourceName = 'product';
  static readonly defaultConfig = config;

  constructor(
    @inject('datasources.config.product', { optional: true })
    dsConfig: object = config,
  ) {
    super(dsConfig);
  }
}
