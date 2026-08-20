const API_URL = import.meta.env.VITE_API_URL;

interface SignUpParams {
	name: string;
	email: string;
	password: string;
}

interface SignUpResponse {
	user: { id: string; email: string; name: string; role: string };
	session: { id: string; token: string };
}

export async function signUpAsCustomer(params: SignUpParams): Promise<SignUpResponse> {
	const res = await fetch(`${API_URL}/api/auth/sign-up/customer`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		credentials: 'include',
		body: JSON.stringify(params),
	});

	const data = await res.json();
	if (!res.ok) throw new Error(data.message ?? 'Unable to create your account.');
	return data;
}

export async function signUpAsAgency(params: SignUpParams): Promise<SignUpResponse> {
	const res = await fetch(`${API_URL}/api/auth/sign-up/agency`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		credentials: 'include',
		body: JSON.stringify(params),
	});

	const data = await res.json();
	if (!res.ok) throw new Error(data.message ?? 'Unable to create your account.');
	return data;
}
