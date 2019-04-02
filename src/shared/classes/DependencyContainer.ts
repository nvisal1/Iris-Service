import { InjectionKey } from "../types/InjectionKey";
import { Injectable } from "../interfaces/Injectable";
import { Class } from "../interfaces/Class";

export class DependencyContainer {
    private container: Map<
        InjectionKey,
        Injectable<any> | Class<any>
    > = new Map();

    public initialize(): void {
        this.container.forEach((val, key) => {
            if (typeof(val) === 'function') {
                let instance;
                if (key )
                try {
                    instance = (<Injectable<any>><unknown>val).getInstance();
                } catch(error) {
                    instance = new (<Class<any>>val)();
                }
                this.register(key, instance);
            }
        });
    }

    public register(
        key: InjectionKey,
        value: Injectable<any> | Class<any>,
    ): void {
        this.container.set(key, value);
    }

    public resolve<T>(key: InjectionKey): T {
        return (this.container.get(key) as any) as T;
    }
}