import { Router } from 'express';
import { handler } from '../../lib/handler';
import locationService from './location.service';

const router = Router();

router.get(
	'/',
	handler(async (_req) => {
		const [error, result] = await locationService.getAll();
		if (error) throw error;
		return result;
	}),
);

export default router;
