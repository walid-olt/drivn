export const parseCookies = (cookieArray: string[]) => {
	return Object.fromEntries(
		cookieArray.map((cookie) => {
			const [cookiePair] = cookie.split(';');
			const [key, ...val] = cookiePair.split('=');
			return [key.trim(), decodeURIComponent(val.join('='))];
		}),
	);
};
