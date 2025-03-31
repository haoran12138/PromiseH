import { promiseState, resolver, ThenFn } from "../type";
export default class MyPromise {
    state: promiseState;
    result: any;
    onFulfilledFns: ThenFn[];
    onRejectedFns: ThenFn[];
    static resolve(value: any): MyPromise;
    static reject(reason: any): MyPromise;
    constructor(fn: resolver);
    then(onFulfilled?: ThenFn, onRejected?: ThenFn): any;
}
