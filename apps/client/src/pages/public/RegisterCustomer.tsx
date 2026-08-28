import AuthLayout from '@/components/layouts/AuthLayout';
import CustomerRegisterForm from '@/features/auth/components/CustomerRegisterForm';

const RegisterCustomer = () => {
	return (
		<AuthLayout>
			<CustomerRegisterForm />
		</AuthLayout>
	);
};

export default RegisterCustomer;
