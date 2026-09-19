import { Router } from 'express';
import { fromNodeHeaders } from 'better-auth/node';
import { getAuth } from '../../lib/auth.ts';
import { handler } from '../../lib/handler.ts';

const router = Router();

const signUp = handler(async (req, res) => {
		const { response, headers } = await getAuth().api.signUpEmail({
			body: { ...req.body, type: 'agency_member' },
			headers: fromNodeHeaders(req.headers),
			returnHeaders: true,
});

		const setCookie = headers.getSetCookie();
		if (setCookie.length) res.setHeader('Set-Cookie', setCookie);
		return response;
	});

router.post('/sign-up/agency', signUp);

export default router;
