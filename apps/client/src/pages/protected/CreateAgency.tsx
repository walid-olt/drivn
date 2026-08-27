import AuthLayout from '@/components/layouts/AuthLayout';
import CreateAgencyForm from '@/features/auth/components/CreateAgencyForm';

export default function CreateAgency() {
	return (
		<AuthLayout>
			<CreateAgencyForm />
		</AuthLayout>
	);
}
