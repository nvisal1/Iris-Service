import { DependencyContainer } from "./DependencyContainer";
import { InjectionKey } from "../types/InjectionKey";
import { ClassProvider } from "../interfaces/ClassProvider";

export abstract class ServiceModule {
    private static dependencies = new DependencyContainer();
    private static providerKeys: InjectionKey[] = [];
    private static _initialized: boolean = false;

    protected static _adapter: any;

    protected constructor() {}

    static initialize(): void {
        if (!this._initialized) {
            this.dependencies.initialize();
            this._initialized = true;
        } else {
            throw new Error(
                `${
                    this.name
                    } is already initialized. Please destroy the existing instance of this module before initializing a new one.`
                );  
        }
    }

    static destroy(): void {
        if (this._initialized) {
            this.dependencies = new DependencyContainer();
            this.providerKeys = [];
            this._adapter = undefined;
            this._initialized = false;
        } else {
            throw new Error(`No instance of ${this.name} has been initialized.`);
        }
    }

    static get adapter():any {
        if (!this._initialized) {
          //   throw new Error(
          //     `${
          //       this.name
          //     } has not yet been initialized. Please use the initializer to utilize this module.`
          //   );
          }
          return this._adapter;
    }

    protected static get initialized(): boolean {
        return this._initialized;
    }

    static set providers(myProviders: ClassProvider[]) {
        if (!this._initialized) {
            myProviders.forEach(provider => {
                let injectionKey = '';
                if (typeof provider.provide === 'string') {
                  injectionKey = provider.provide;
                } else {
                  injectionKey = provider.provide.name;
                }
                this.providerKeys.push(injectionKey);
                this.dependencies.register(injectionKey, provider.useClass);
            });
        } else {
            throw new Error(
              `${
                this.name
              } has already been initialized. Cannot set providers after module is initialized.`
            );
        }
    }

    static resolveDependency<T>(dependency: Constructor<T>): T {
        if (!this._initialized) {
          throw new Error(
            `${
              this.name
            } has not yet been initialized. Please use the initializer to utilize this module.`
          );
        }
        if (!this.providerKeys.includes(dependency.name)) {
          throw new Error(`No provider for ${dependency.name}.`);
        }
        return this.dependencies.resolve(dependency.name);
    }
}   

export function serviceModule({
    adapter,
    providers = []
  }: {
    adapter: any;
    providers: ClassProvider[];
  }) {
    return function(target: any) {
      target._adapter = adapter;
      target.providers = providers;
    };
  }
  
