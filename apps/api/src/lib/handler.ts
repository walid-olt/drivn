import type { ApiResponse } from '@drivn/shared';
import type { Request, Response, NextFunction, RequestHandler } from 'express';

/**
 * @desc This type represents the possible return values of a controller function.
 *
 * @template Data - The type of the data that the controller function returns.
 * @property {Data} - The raw data returned by the controller function.
 * @property {object} - An object containing the data, an optional message, optional meta information, and an optional status code.
 * */
export type ControllerResult<Data = unknown> =
	| Data
	| { data: Data; message?: string; meta?: unknown; statusCode?: number };

/**
 * @desc inspired by NestJS automatic response handling,
 * this function wraps an async controller function and standardizes the response format.
 *
 * @param fn - The controller function to wrap. It should return either raw data or an object containing data, message, meta, and statusCode.
 * @returns A RequestHandler that handles the response formatting and error handling.
 * @example
 * ```ts
 * router.get('/example', handler(async (req, res) => {
 *  const data = await someAsyncOperation();
 *  return { data, message: 'Operation successful', statusCode: 200 }; // or just return data directly
 *  }
 * ```
 */
export const handler = <Data>(
	fn: (req: Request, res: Response, next: NextFunction) => Promise<ControllerResult<Data>>,
): RequestHandler => {
	return (req: Request, res: Response, next: NextFunction) => {
		Promise.resolve(fn(req, res, next))
			.then((result) => {
				// If headers are already sent (e.g., file download, manual res.end), do nothing
				if (res.headersSent) return;

				let statusCode = 200;
				let responseBody: ApiResponse<Data>;

				// Check if the controller returned the advanced object structure or just raw data
				if (result && typeof result === 'object' && 'data' in result) {
					const { data, message, meta, statusCode: customStatus } = result as any;
					statusCode = customStatus || 200;
					responseBody = {
						success: true,
						...(message && { message }),
						...(meta && { meta }),
						data,
					};
				} else {
					// If the controller just returned raw data directly
					responseBody = {
						success: true,
						data: result as Data,
					};
				}

				res.status(statusCode).json(responseBody);
			})
			.catch(next);
	};
};
