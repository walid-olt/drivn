import { toast } from '@/components/ui/toast';
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
		<section>
			<LoginForm />
		</section>
	);
};

export default Login;
