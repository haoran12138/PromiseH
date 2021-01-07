export type promiseState = 'pending' | 'fulfilled' | 'rejected'
export interface ThenFn {
  (value?: any): any
}
export interface PromiseH {
  state: promiseState
  result: any
  then(onFulfilled?: (value: any) => any, onRejected?: (value: any) => any): PromiseH
}

export interface promiseStateItem {
  pending: promiseState
  fulfilled: promiseState
  rejected: promiseState
}
