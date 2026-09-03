export type Result<T, E = Error> = [error: E, data: undefined] | [error: undefined, data: T];
export async function tryCatch<T, E = Error>(
	promise: Promise<T>,
	// Optional mapper to format unknown catch errors into your expected Error type
	errorMapper?: (err: unknown) => E,
): Promise<Result<T, E>> {
	try {
		const data = await promise;
		return [undefined, data];
	} catch (error) {
		// If a mapper is provided, use it.
		// Otherwise, ensure we always return a standard Error object.
		if (errorMapper) {
			return [errorMapper(error), undefined];
		}

		const normalizedError = error instanceof Error ? error : new Error(String(error));

		return [normalizedError as E, undefined];
	}
}

export function tryCatchSync<T, E = Error>(
	fn: () => T,
	errorMapper?: (err: unknown) => E,
): Result<T, E> {
	try {
		return [undefined, fn()];
	} catch (error) {
		if (errorMapper) {
			return [errorMapper(error), undefined];
		}

		const normalizedError = error instanceof Error ? error : new Error(String(error));

		return [normalizedError as E, undefined];
	}
}

export function ok<T>(data: T): Result<T, never> {
	return [undefined, data];
}

export function err<E>(error: E): Result<never, E> {
	return [error, undefined];
}
