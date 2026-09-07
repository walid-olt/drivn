import { Model } from 'mongoose';
import LocationModel, { type LocationDocument } from './models/location.model';
import { tryCatch } from '../../lib/result';

class LocationService {
	constructor(private readonly locationModel: Model<LocationDocument>) {}

	getAll = async () => {
		return tryCatch(this.locationModel.find().sort({ name: 1 }).exec());
	};

	getById = (id: string) => tryCatch(this.locationModel.findById(id));

	getManyByIds = (ids: string[]) => tryCatch(this.locationModel.find({ _id: { $in: ids } }));
}

export default new LocationService(LocationModel);
