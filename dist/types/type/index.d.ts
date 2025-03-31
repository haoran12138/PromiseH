export type promiseState = 'pending' | 'fulfilled' | 'rejected';
export type ThenFn = (value: any) => any;
export type resolver = (resolve: ThenFn, reject: ThenFn) => void;
