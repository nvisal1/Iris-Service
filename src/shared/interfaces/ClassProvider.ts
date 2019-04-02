import { InjectionKey } from "../types/InjectionKey";
import { Injectable } from "./Injectable";
import { Class } from "./Class";

export interface ClassProvider {
    provide: Constructor<any> | InjectionKey;
    useClass: Injectable<any> | Class<any>;
}