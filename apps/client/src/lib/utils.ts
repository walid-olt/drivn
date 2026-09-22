import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { redirect } from 'react-router';
import { type Result } from '@drivn/shared';
export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function redirectToLogin(request: Request, message?: string): never {
	const url = new URL(request.url);

	// check for redirectTo in local storage, if it exists, use that as the redirect url, otherwise use the current path
	const redirectTo = localStorage.getItem('redirectTo');

	if (!redirectTo) localStorage.setItem('redirectTo', `${url.pathname}${url.search}`);

	const redirectUrl = new URL('/login', url.origin);
	redirectUrl.searchParams.set('message', message || 'You must be logged in to access this page.');
	throw redirect(redirectUrl.toString());
}

export function unwrap<T>([err, data]: Result<T>): T {
	if (err) throw err;
	return data as T;
}

export function getRedirectUrl(
	request: Request,
	targetPath: string = '/login',
	paramName: string = 'redirectTo',
): string {
	const url = new URL(request.url);

	const currentPath = `${url.pathname}${url.search}`;

	const redirectUrl = new URL(targetPath, url.origin);
	redirectUrl.searchParams.set(paramName, currentPath);

	return redirectUrl.pathname + redirectUrl.search;
}
export function getExtensionFromMime(mimeType: string) {
	const mimeMap: Record<string, string> = {
		'image/jpeg': 'jpg',
		'image/jpg': 'jpg',
		'image/png': 'png',
		'image/webp': 'webp',
	};

	return mimeType in mimeMap ? mimeMap[mimeType] : 'bin';
}

export function getInitials(name: string) {
	return name
		.split(' ')
		.map((part) => part[0])
		.join('')
		.slice(0, 2)
		.toUpperCase();
}

export const avatarColors = ['#2563eb', '#9333ea', '#db2777', '#ea580c', '#16a34a', '#0891b2'];

export function getAvatarColor(name: string) {
	return avatarColors[name.length % avatarColors.length];
}
