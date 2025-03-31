import MyPromise from "./myPromise";
import { promiseStateItem } from "../type";
export declare function isPlanObject(val: any): val is Object;
export declare function isFunction(val: any): val is Function;
export declare function isMyPromise(val: any): val is MyPromise;
export declare const promsieStateList: promiseStateItem;
export declare function fulfilledPromise(promise: MyPromise, value: any): void;
export declare function rejectedPromise(promise: MyPromise, reason: any): void;
