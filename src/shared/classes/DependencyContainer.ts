import { InjectionKey } from "../types/InjectionKey";
import { Injectable } from "../interfaces/Injectable";
import { Class } from "../interfaces/Class";

export class DependencyContainer {
    private container: Map<
        InjectionKey,
        Injectable<any> | Class<any>
    > = new Map();


    public initialize(): void {
        let counter = 0
        console.log(this.container);
        this.container.forEach((val, key) => {
            // console.log(counter);
            // counter ++;
            // console.log('val',val);
            // console.log('key',key);
            let instance;
            try {
                instance = (<Injectable<any>>val).getInstance();
            } catch(error) {
                instance = new (<Class<any>>val)();
            }
            this.register(key, instance);
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