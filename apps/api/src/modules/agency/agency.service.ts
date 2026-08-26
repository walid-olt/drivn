import { Model } from 'mongoose';
import Agency, { type AgencyDocument } from './agency.model';
import { tryCatch } from '../../lib/result';
import type { createAgencyDto, updateAgencyDto } from '@drivn/shared';

class AgencyService {
	constructor(private readonly agencyModel: Model<AgencyDocument>) {}
	create = (data: createAgencyDto) => tryCatch(this.agencyModel.create(data));
	update = (id: string, data: updateAgencyDto) =>
		tryCatch(this.agencyModel.findByIdAndUpdate(id, data, { new: true }));

	getById = (id: string) => tryCatch(this.agencyModel.findById(id));
	getByOrganizationId = (organizationId: string) =>
		tryCatch(this.agencyModel.findOne({ organizationId }));
}

export default new AgencyService(Agency);
