import { Router } from 'express';
import { handler } from '../../lib/handler';
import { authenticate, requireAgency } from '../../middleware';
import reservationController from './reservation.controller';

const router = Router();

router.use(authenticate, requireAgency);
router.get('/', handler(reservationController.getByAgency));
router.post('/', handler(reservationController.create));
router.get('/:id', handler(reservationController.getById));
router.patch('/:id/status', handler(reservationController.updateStatus));

export default router;
