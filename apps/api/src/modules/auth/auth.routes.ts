import { Router } from 'express';
import { fromNodeHeaders } from 'better-auth/node';
import { getAuth } from '../../lib/auth.ts';
import { handler } from '../../lib/handler.ts';

const router = Router();

const signUp = (type: 'customer' | 'agency_member') =>
	handler(async (req, res) => {
		const { response, headers } = await getAuth().api.signUpEmail({
			body: { ...req.body, type },
			headers: fromNodeHeaders(req.headers),
			returnHeaders: true,
		});

		const setCookie = headers.getSetCookie();
		if (setCookie.length) res.setHeader('Set-Cookie', setCookie);
		return response;
	});

router.post('/sign-up/customer', signUp('customer'));

router.post('/sign-up/agency', signUp('agency_member'));

export default router;
