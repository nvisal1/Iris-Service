import { ExpressServiceModule, expressServiceModule } from '../shared/classes/ExpressServiceModule';
import * as ExpressRouterAdapter from './adapters/ExpressRouterAdapter';
import { ModuleAdapter } from './adapters/ModuleAdapter';
import { UserDataStore } from './interfaces/UserDataStore';
import { MongoUserDataStore } from './drivers/MongoUserDataStore';

@expressServiceModule({
    adapter: ModuleAdapter,
    publicExpressRouter: ExpressRouterAdapter.buildPublicRouter(),
    privateExpressRouter: ExpressRouterAdapter.buildPrivateRouter(),
    providers: [
        {
          provide: UserDataStore,
          useClass: MongoUserDataStore
        }
      ]
})

export class Users extends ExpressServiceModule {};
