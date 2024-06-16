type TupleToUnion<T extends any[]> = T[number];
export type OmitMultiple<T, K extends (keyof T)[]> = Omit<T, TupleToUnion<K>>;
