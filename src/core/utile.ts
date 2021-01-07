import { promiseState, promiseStateItem } from '../type'
import PromiseH from './PromiseH'

const toString = Object.prototype.toString
export function isPlainObject(obj: any): obj is Object {
  return toString.call(obj) === '[object Object]'
}

export function isFunction(obj: any): obj is Function {
  return toString.call(obj) === '[object Function]'
}

export function isPromiseH(p: any): p is PromiseH {
  return p instanceof PromiseH
}
export function fulfilledPromise(promise: PromiseH, value: any) {
  if (promise.state !== promiseStateList.pending) return
  promise.state = promiseStateList.fulfilled
  promise.result = value
  promise.onFulfilledCabs.forEach(cb => {
    cb(value)
  })
}
export function rejectedPromise(promise: PromiseH, reason: any) {
  if (promise.state !== promiseStateList.pending) return
  promise.state = promiseStateList.rejected
  promise.result = reason
  promise.onRejectedCabs.forEach(cb => {
    cb(reason)
  })
}

export const promiseStateList: promiseStateItem = {
  pending: 'pending',
  fulfilled: 'fulfilled',
  rejected: 'rejected'
}
