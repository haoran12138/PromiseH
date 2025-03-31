import { promiseState, ThenFn, resolver } from "../type";
export default class MyPromise {
    state: promiseState;
    result: any;
    onFulfilledCabs: ThenFn[];
    onRejectedCabs: ThenFn[];
    static resolve(value: any): MyPromise;
    static reject(reason: any): MyPromise;
    constructor(fn: resolver);
    then(onFulfilled: any, onRejected: any): MyPromise;
}
