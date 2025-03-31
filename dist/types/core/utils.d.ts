import MyPromise from "./myPromise";
export declare function isPromise(v: any): v is MyPromise;
export declare function isFunction(fn: any): fn is Function;
export declare function isPlainObject(val: any): val is Object;
export declare function onFulfilledPromise(promise: any, value: any): void;
export declare function onRejectedPromise(promise: any, value: any): void;
