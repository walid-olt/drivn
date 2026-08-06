export type Result<T, E = Error> = [error: E, data: undefined] | [error: undefined, data: T];
