import { Model } from 'mongoose';
import Agency, { type AgencyDocument } from './agency.model';
import { tryCatch } from '../../lib/result';
import type { Result } from '../../types/result';
import type {
	CreateAgencyDto,
	UpdateAgencyDto,
	UpdateAgencyBrandingDto,
	UpdateAgencyLocationsDto,
	UpdateAgencySupportDto,
} from '@drivn/shared';
import { conflict } from '../../errors';
type OnboardingStatus = AgencyDocument['onboardingStatus'];
class AgencyService {
	constructor(private readonly agencyModel: Model<AgencyDocument>) {}
	/**
	 * Returns the status that follows the given one. `onboardingStatus` holds
	 * the last completed step, so this is also the next step to complete.
	 */
	getNextOnboardingStatus = (currentStatus: OnboardingStatus): OnboardingStatus => {
		switch (currentStatus) {
			case 'not_started':
				return 'branding';
			case 'branding':
				return 'support';
			case 'support':
				return 'locations';
			case 'locations':
				return 'completed';
			case 'completed':
				return 'completed';
			default:
				throw new Error(`Unknown onboarding status: ${currentStatus}`);
		}
	};

	create = (data: CreateAgencyDto) => tryCatch(this.agencyModel.create(data));
	update = (id: string, data: UpdateAgencyDto) =>
		tryCatch(this.agencyModel.findByIdAndUpdate(id, data, { new: true }));

	getById = (id: string) => tryCatch(this.agencyModel.findById(id));
	getByOrganizationId = (organizationId: string) =>
		tryCatch(this.agencyModel.findOne({ organizationId }));

	/**
	 * Strict sequential step advance: updates the agency and moves it to the
	 * next onboarding step **only if** its current status matches `expected`.
	 */
	private advanceStep = async (
		id: string,
		expected: OnboardingStatus,
		fields?: Record<string, unknown>,
	): Promise<Result<AgencyDocument>> => {
		const [error, agency] = await tryCatch(
			this.agencyModel.findOneAndUpdate(
				{ _id: id, onboardingStatus: expected },
				{
					$set: {
						...fields,
						onboardingStatus: this.getNextOnboardingStatus(expected),
					},
				},
				{ returnDocument: 'after' },
			),
		);
		if (error) return [error, undefined];
		if (!agency) {
			return [
				conflict(
					`Onboarding step out of order: expected status "${expected}" but it doesn't match`,
				),
				undefined,
			];
		}
		return [undefined, agency];
	};

	completeBranding = (id: string, data: UpdateAgencyBrandingDto) =>
		this.advanceStep(id, 'not_started', data);
	completeSupport = (id: string, data: UpdateAgencySupportDto) =>
		this.advanceStep(id, 'branding', data);
	/**
	 * Completes the last step: `support` → `locations` → `completed`.
	 */
	completeLocations = async (id: string, data: UpdateAgencyLocationsDto) => {
		const [error, agency] = await this.advanceStep(id, 'support', data);
		if (error) return [error, undefined] as Result<AgencyDocument>;
		return this.advanceStep(agency!._id.toString(), 'locations');
	};
}

export default new AgencyService(Agency);
