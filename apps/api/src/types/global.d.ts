import type { User, AuthSession } from '../lib/auth';
import type { AgencyDocument } from '../modules/agency/agency.model';

declare global {
	namespace Express {
		interface Request {
			user?: User;
			session?: AuthSession;
			agency?: AgencyDocument;
		}
	}
}

export {};
