import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { redirect } from 'react-router';
import { type Result } from '@drivn/shared';
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
