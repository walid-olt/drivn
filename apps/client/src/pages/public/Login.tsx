import AuthLayout from '@/components/layouts/AuthLayout';
import LoginForm from '@/features/auth/components/LoginForm';

const Login = () => {
	const searchParams = new URLSearchParams(window.location.search);
	const message = searchParams.get('message');
	return (
		<AuthLayout>
			<LoginForm initialMessage={message} />
		</AuthLayout>
	);
};

export default Login;
