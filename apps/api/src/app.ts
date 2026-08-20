import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { mongo } from 'mongoose';
import { errorHandler } from './middleware/error.middleware.ts';
import { handler } from './lib/handler.ts';
import { toNodeHandler } from 'better-auth/node';
import { auth } from './lib/auth.ts';
import { createAuthRoutes } from './modules/auth/auth.routes.ts';

export function createApp(db: mongo.Db): express.Express {
	const app = express();
	const authInstance = auth(db);

	app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));
	app.use(morgan('dev'));
	app.use(express.json());

	app.use('/api/auth', createAuthRoutes(db));
	app.all('/api/auth/{*any}', toNodeHandler(authInstance));

	// Make auth instance available to route middleware via req.app.locals.auth
	app.locals.auth = authInstance;

	app.use('/assets', express.static('assets'));
	app.use(
		'/health',
		handler(async () => {
			return { status: 'ok' };
		}),
	);
	app.use(errorHandler);

	return app;
}
