import type {
	ApplySchemaOptions,
	FlatRecord,
	HydratedDocument,
	Model,
	ObtainDocumentType,
	/* QueryWithHelpers, */
	ResolveSchemaOptions,
} from 'mongoose';

export type SponsorVirtual = object;

export interface SponsorInstanceMethods {}
export type SponsorQueryHelpers = object;
export interface SponsorDocument
	extends ApplySchemaOptions<
		ObtainDocumentType<SponsorDocument, SponsorI, ResolveSchemaOptions<SponsorSchemaOptions>>,
		ResolveSchemaOptions<SponsorSchemaOptions>
	> {}
export interface SponsorHydratedDocument
	extends HydratedDocument<
		FlatRecord<SponsorDocument>,
		SponsorInstanceMethods & SponsorVirtual,
		SponsorQueryHelpers
	> {}

export interface SponsorStaticMethods {
	// custom static methods here
}
export interface SponsorSchemaOptions {
	_id: true;
	timestamps: true;
}
export interface SponsorModel
	extends Model<SponsorI, SponsorQueryHelpers, SponsorInstanceMethods, SponsorVirtual, SponsorHydratedDocument>,
		SponsorStaticMethods {}
