import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { mongo } from 'mongoose';
import { errorHandler } from './middleware/error.middleware.ts';
import { handler } from './lib/handler.ts';
import { toNodeHandler } from 'better-auth/node';
import { auth } from './lib/auth.ts';

export function createApp(db: mongo.Db): express.Express {
	const app = express();

	const NODE_ENV = process.env.NODE_ENV ?? 'development';
	if (NODE_ENV === 'development' || NODE_ENV === 'test') {
		app.use(cors());
	} else {
		app.use(cors({ origin: process.env.FRONTEND_URL }));
	}
	app.all('/api/auth/{*any}', toNodeHandler(auth(db)));
	app.use(morgan('dev'));

	app.use('/assets', express.static('assets'));
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
