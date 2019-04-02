import { Router } from "express";
import { ServiceModule, serviceModule } from "./ServiceModule";
import { ClassProvider } from "../interfaces/ClassProvider";

export abstract class ExpressServiceModule extends ServiceModule {
    protected static _publicExpressRouter: Router;
    protected static _privateExpressRouter: Router;

    static get publicExpressRouter(): Router {
        if (!this.initialized) {
            throw new Error(
            `${
                this.name
              } has not yet been initialized. Please use the initializer to utilize this module.`
            );
        }
        return this._publicExpressRouter;
    }

    static get privateExpressRouter(): Router {
        if (!this.initialized) {
            throw new Error(
            `${
                this.name
              } has not yet been initialized. Please use the initializer to utilize this module.`
            );
        }
        return this._privateExpressRouter;
    }
}

export function expressServiceModule({
    adapter,
    publicExpressRouter,
    privateExpressRouter,
    providers = []
  }: {
    adapter: any;
    publicExpressRouter: Router;
    privateExpressRouter: Router;
    providers: ClassProvider[];
  }) {
    return function(target: any) {
      target._publicExpressRouter = publicExpressRouter;
      target._privateExpressRouter = privateExpressRouter;
      serviceModule({ adapter, providers })(target);
    };
  }