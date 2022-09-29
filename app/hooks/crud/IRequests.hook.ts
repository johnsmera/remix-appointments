export type IList<TList, TFilter> = (param: TFilter) => Promise<TList[]>;
