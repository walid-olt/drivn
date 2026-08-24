import type { Session } from 'better-auth';
import type { User } from '../lib/auth';

declare global {
	namespace Express {
		interface Request {
			user?: User;
			session?: Session;
		}
	}
}
