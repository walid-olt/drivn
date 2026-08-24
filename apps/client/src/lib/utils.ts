import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { redirect } from 'react-router';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function redirectToLogin(request: Request, message?: string): never {
	const url = new URL(request.url);

	const loginUrl = new URL('/login', url.origin);

	const params = new URLSearchParams({
		redirectTo: url.pathname + url.search,
		...(message && { message }),
	});

	loginUrl.search = params.toString();

	throw redirect(loginUrl.toString());
}
