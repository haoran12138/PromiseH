import { promiseState, promiseStateItem } from '../type'
import {
  isFunction,
  isPlainObject,
  isPromiseH,
  fulfilledPromise,
  rejectedPromise,
  promiseStateList
} from './utile'

export default function resolvePromise(promise: any, x: any) {
  if (promise === x) {
    rejectedPromise(promise, new TypeError('Chaining cycle detected for promise'))
    return
  }
  if (isPromiseH(x)) {
    if (x.state === promiseStateList.pending) {
      x.then(
        (value: any) => {
          resolvePromise(promise, value)
        },
        (reason: any) => {
          rejectedPromise(promise, reason)
        }
      )
      return
    }
    if (x.state === promiseStateList.fulfilled) {
      fulfilledPromise(promise, x)
      return
    }
    if (x.state === promiseStateList.rejected) {
      rejectedPromise(promise, x.result)
      return
    }
    return
  }

  if (isFunction(x) || isPlainObject(x)) {
    let flag = true
    let then
    try {
      then = x.then
    } catch (error) {
      rejectedPromise(promise, error)
      return
    }
    if (isFunction(then)) {
      try {
        then.call(
          x,
          (y: any) => {
            if (!flag) return
            flag = false
            resolvePromise(promise, y)
          },
          (r: any) => {
            if (!flag) return
            flag = false
            rejectedPromise(promise, r)
          }
        )
      } catch (error) {
        if (!flag) return
        flag = false
        rejectedPromise(promise, error)
      }
      return
    } else {
      fulfilledPromise(promise, x)
      return
    }
  } else {
    fulfilledPromise(promise, x)
    return
  }
}
