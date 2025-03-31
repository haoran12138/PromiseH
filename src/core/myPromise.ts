import { promiseState, ThenFn, resolver } from "../type";
import { fulfilledPromise, isFunction, rejectedPromise } from "./utils";
import resolvePromise from "./resolvePromise";

export default class MyPromise {
  state: promiseState;
  result: any;
  onFulfilledCabs: ThenFn[];
  onRejectedCabs: ThenFn[];

  static resolve(value) {
    return new MyPromise((resolveFn, rejectFn) => {
      resolveFn(value);
    });
  }

  static reject(reason) {
    return new MyPromise((resolveFn, rejectFn) => {
      rejectFn(reason);
    });
  }

  constructor(fn: resolver) {
    if (!isFunction(fn)) {
      throw new TypeError(`Promise resolver ${ fn } is not a function`);
    }
    this.state = "pending";
    this.result = undefined;
    this.onFulfilledCabs = [];
    this.onRejectedCabs = [];
    fn(
      (value) => {
        fulfilledPromise(this, value);
      },
      (reason) => {
        rejectedPromise(this, reason);
      }
    );
  }

  then(onFulfilled, onRejected) {
    onFulfilled = isFunction(onFulfilled) ? onFulfilled : (value) => value;
    onRejected = isFunction(onRejected)
      ? onRejected
      : (reason) => {
        throw reason;
      };
    const promise2 = new MyPromise((resolve, reject) => {
      if (this.state === "fulfilled") {
        setTimeout(() => {
          try {
            let x = onFulfilled(this.result);
            resolvePromise(promise2, x);
          } catch (e) {
            rejectedPromise(promise2, e);
          }
        }, 0);
      }
      if (this.state === "rejected") {
        setTimeout(() => {
          try {
            let x = onRejected(this.result);
            resolvePromise(promise2, x);
          } catch (e) {
            rejectedPromise(promise2, e);
          }
        }, 0);
      }
      if (this.state === "pending") {
        this.onFulfilledCabs.push(() => {
          setTimeout(() => {
            try {
              const x = onFulfilled(this.result);
              resolvePromise(promise2, x);
            } catch (err) {
              rejectedPromise(promise2, err);
            }
          }, 0);
        });
        this.onRejectedCabs.push(() => {
          setTimeout(() => {
            try {
              const x = onRejected(this.result);
              resolvePromise(promise2, x);
            } catch (err) {
              rejectedPromise(promise2, err);
            }
          }, 0);
        });
      }
    });
    return promise2;
  }
}
