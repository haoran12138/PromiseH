import MyPromise from "./myPromise";
import { promiseStateItem } from "../type";

const toString = Object.prototype.toString

export function isPlanObject(val: any): val is Object {
  return toString.call(val) === '[object Object]'
}

export function isFunction(val: any): val is Function {
  return toString.call(val) === '[object Function]'
}

export function isMyPromise(val: any): val is MyPromise {
  return val instanceof MyPromise
}

export const promsieStateList: promiseStateItem = {
  pending: 'pending',
  fulfilled: 'fulfilled',
  rejected: 'rejected',
}

export function fulfilledPromise(promise: MyPromise, value: any) {
  if (promise.state !== 'pending') return
  promise.state = 'fulfilled'
  promise.result = value
  promise.onFulfilledCabs.forEach(cb => cb(value))
}

export function rejectedPromise(promise: MyPromise, reason: any) {
  if (promise.state !== 'pending') return
  promise.state = 'rejected'
  promise.result = reason
  promise.onRejectedCabs.forEach(cb => cb(reason))
}
