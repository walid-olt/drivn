import AuthLayout from '@/components/layouts/AuthLayout';
import AgencyRegisterForm from '@/features/auth/components/AgencyRegisterForm';

const RegisterAgency = () => {
	return (
		<AuthLayout>
			<AgencyRegisterForm />
		</AuthLayout>
	);
};

export default RegisterAgency;
