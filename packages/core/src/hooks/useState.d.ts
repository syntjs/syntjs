export declare function useState<T>(initial: T): [T, (value: T | ((prev: T) => T)) => void];
export declare const useStateSimple: typeof useState;
