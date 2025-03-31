import MyPromise from "./myPromise";

const toString = Object.prototype.toString

export function isPromise(v): v is MyPromise {
  return v instanceof MyPromise
}

export function isFunction(fn: any): fn is Function {
  return toString.call(fn) === '[object Function]'
}

export function isPlainObject(val: any): val is Object {
  return toString.call(val) === '[object Object]'
}

export function onFulfilledPromise(promise, value) {
  if (promise.status !== 'pending') return
  promise.status = 'fulfilled'
  promise.result = value;
  promise.onFulfilledFns.forEach(fn => {
    fn(value)
  })
}

export function onRejectedPromise(promise, value) {
  if (promise.status !== 'pending') return
  promise.status = 'rejected'
  promise.result = value;
  promise.onRejectedFns.forEach(fn => {
    fn(value)
  })
}

