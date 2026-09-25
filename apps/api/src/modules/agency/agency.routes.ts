import { Router } from 'express';
import { handler } from '../../lib/handler';
import { authenticate, requireAgency } from '../../middleware';
import { uploadBrandingFiles } from '../../middleware/upload.middleware';
import { agencyController } from './agency.controller';

const router = Router();
router.use(authenticate, requireAgency);

router.get('/', handler(agencyController.getAgency));

router.put('/locations', handler(agencyController.updateLocations));

router.put(
	'/onboarding/branding',
	uploadBrandingFiles,
	handler(agencyController.setAgencyBranding),
);

router.put('/onboarding/support', handler(agencyController.setAgencySupport));

router.put('/onboarding/locations', handler(agencyController.setAgencyLocations));

export default router;
