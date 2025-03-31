export type promiseState = 'pending' | 'fulfilled' | 'rejected';

export interface ThenFn {
  (valye?: any): any
}

export interface MyPromise {
  state: promiseState;
  result: any,

  then(onFulfilled?: (value: any) => any, onRejected?: (value: any) => any): MyPromise
}

export interface promiseStateItem {
  pending: promiseState
  fulfilled: promiseState
  rejected: promiseState
}

export interface resolver {
  (resolve: ThenFn, reject?: ThenFn): void
}
