import { type Env } from '../config/env.ts';
declare global {
	namespace NodeJS {
		interface ProcessEnv extends Env {}
	}
}
