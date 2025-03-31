import {
  isPromise,
  isFunction,
  isPlainObject,
  onFulfilledPromise,
  onRejectedPromise,

} from "./utils";


export default function resolvePromise(promise, x) {
  if (promise === x) {
    onRejectedPromise(promise, new TypeError('Chaining cycle detected for promise'))
    return
  }
  if (isPromise(x)) {
    if (x.status === 'pending') {
      x.then(value => {
        resolvePromise(promise, value)
      }, reason => {
        onRejectedPromise(promise, reason)
      })
    }
    if (x.status === 'fulfilled') {
      onFulfilledPromise(promise, x.result)
    }
    if (x.status === 'rejected') {
      onRejectedPromise(promise, x.result)
    }
    return;
  }
  if (isFunction(x) || isPlainObject(x)) {
    let flag = false;
    let then
    try {
      then = x.then
    } catch (e) {
      onRejectedPromise(promise, e)
      return;
    }
    if (isFunction(then)) {
      try {
        then.call(x, y => {
          if (flag) return
          flag = true;
          resolvePromise(promise, y)
        }, r => {
          if (flag) return
          flag = true;
          onRejectedPromise(promise, r)
        })
      } catch (e) {
        if (flag) return
        flag = true;
        onRejectedPromise(promise, e)
      }
    } else {
      onFulfilledPromise(promise, x)
    }
  } else {
    onFulfilledPromise(promise, x)
  }
}
