import { v2 as cloudinary } from 'cloudinary';

import { cLogger } from '$server/console';

import { OI_CLOUDINARY_API_KEY, OI_CLOUDINARY_API_SECRET, OI_CLOUDINARY_CLOUD_NAME } from '&server/env';

import Service from './Service';
const id = 'CloudinaryService';
export default class CloudinaryService extends Service<void> {
	name = 'Cloudinary';
	category = 'Storage';
	description = 'Gestion du stockage Cloudinary';
	constructor(enabled = true) {
		super(id, enabled ? CloudinaryService.connect() : Promise.resolve());
	}
	public static async connect() {
		cloudinary.config({
			cloud_name: OI_CLOUDINARY_CLOUD_NAME,
			api_key: OI_CLOUDINARY_API_KEY,
			api_secret: OI_CLOUDINARY_API_SECRET,
		});
		return CloudinaryService.checkConnection().then(() => {
			cLogger.info('☁️  Le service Cloudinary est activé');
		}).catch((err)=>{
			console.log(err);
			cLogger.error('❌  Le service Cloudinary est désactivé');
			throw err
		});
	}
	public static async checkConnection() {
		return cloudinary.api.ping();
	}
	public stop(): Promise<void> {
		return Promise.resolve();
	}
}
