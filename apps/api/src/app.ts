import express from 'express';
import morgan from 'morgan';
import { errorHandler } from './middleware/error.middleware.js';

export function createApp(): express.Express {
	const app = express();

	app.use(morgan('dev'));
	app.use(express.json());

	app.get('/health', (_req, res) => {
		res.status(200).json({ status: 'ok' });
	});

	app.use(errorHandler);

	return app;
}
