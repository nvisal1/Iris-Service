import { ExpressServiceModule, expressServiceModule } from '../shared/classes/ExpressServiceModule';
import { StreamDataStore } from './interfaces/StreamDataStore';
import * as ExpressRouterAdapter from './adapters/ExpressRouterAdapter';
import { MongoStreamDataStore } from './drivers/MongoStreamDataStore';
import { ModuleAdapter } from './adapters/ModuleAdapter';

@expressServiceModule({
    adapter: ModuleAdapter,
    publicExpressRouter: ExpressRouterAdapter.buildPublicRouter(),
    privateExpressRouter: ExpressRouterAdapter.buildPrivateRouter(),
    providers: [
        {
          provide: StreamDataStore,
          useClass: MongoStreamDataStore
        }
      ]
})

export class Streams extends ExpressServiceModule {};
