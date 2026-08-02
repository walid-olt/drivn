import express from 'express';
import morgan from 'morgan';
import { errorHandler } from './middleware/error.middleware.ts';
import { handler } from './lib/handler.ts';

export function createApp(): express.Express {
	const app = express();

	app.use(morgan('dev'));
	app.use(express.json());

	app.use(
		'/health',
		handler(async () => {
			return { status: 'ok' };
		}),
	);
	app.use(errorHandler);

	return app;
}
