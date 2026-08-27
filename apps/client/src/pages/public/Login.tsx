import { toast } from '@/components/ui/toast';
import AuthLayout from '@/components/layouts/AuthLayout';
import LoginForm from '@/features/auth/components/LoginForm';
import { useEffect } from 'react';

const Login = () => {
	const searchParams = new URLSearchParams(window.location.search);
	const message = searchParams.get('message');
	useEffect(() => {
		if (message && message.trim().length > 0) {
			toast.add({
				title: message,
				type: 'error',
			});
		}
	}, [message]);
	return (
		<AuthLayout>
			<LoginForm />
		</AuthLayout>
	);
};

export default Login;
