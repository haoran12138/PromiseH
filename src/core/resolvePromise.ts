import {
  isMyPromise,
  rejectedPromise,
  fulfilledPromise,
  isFunction,
  isPlanObject,
} from "./utils";

export default function resolvePromise(promise, x) {
  if (promise === x) {
    return rejectedPromise(
      promise,
      new TypeError("Chaining cycle detected for promise")
    );
  }
  if (isMyPromise(x)) {
    if (x.state === "pending") {
      x.then(
        (value) => {
          resolvePromise(promise, value);
        },
        (reason) => {
          rejectedPromise(promise, reason);
        }
      );
      return;
    }
    if (x.state === "fulfilled") {
      fulfilledPromise(promise, x.result);
      return;
    }
    if (x.state === "rejected") {
      rejectedPromise(promise, x.result);
      return;
    }
    return;
  }

  if (isFunction(x) || isPlanObject(x)) {
    let flag = false;
    let then;
    try {
      then = x.then;
    } catch (err) {
      rejectedPromise(promise, err);
      return;
    }

    if (isFunction(then)) {
      try {
        then.call(
          x,
          (y) => {
            if (flag) return;
            flag = true;
            resolvePromise(promise, y);
          },
          (r) => {
            if (flag) return;
            flag = true;
            rejectedPromise(promise, r);
          }
        );
      } catch (err) {
        if (flag) return;
        flag = true;
        rejectedPromise(promise, err);
      }
    } else {
      fulfilledPromise(promise, x);
      return
    }
  } else {
    fulfilledPromise(promise, x);
    return
  }
}
