import { Router } from 'express';
import { authenticate, requireAgency } from '../../middleware';
import carController from './car.controller';
import { handler } from '../../lib/handler';
import { handleUploadCarImages } from './car.middleware';

const agencyCarsRouter = Router();
const router = Router();
router.get('/agency', authenticate, requireAgency, handler(carController.getAgencyCars));
agencyCarsRouter.post(
	'/',
	handleUploadCarImages,
	handler(carController.create),
);
agencyCarsRouter.put('/:id', handleUploadCarImages, handler(carController.update));
agencyCarsRouter.patch('/:id', handleUploadCarImages, handler(carController.update));
agencyCarsRouter.delete('/:id', handler(carController.delete));

router.use(authenticate, requireAgency, agencyCarsRouter);

export default router;
