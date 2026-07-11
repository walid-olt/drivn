import express from 'express';
import morgan from 'morgan';

export function createApp(): express.Express {
	const app = express();

	app.use(morgan('dev'));
	app.use(express.json());

	app.get('/health', (_req, res) => {
		res.status(200).json({ status: 'ok' });
	});

	return app;
}
