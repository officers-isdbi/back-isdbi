import type {
	ApplySchemaOptions,
	FlatRecord,
	HydratedDocument,
	Model,
	ObtainDocumentType,
	/* QueryWithHelpers, */
	ResolveSchemaOptions,
} from 'mongoose';

export type NumberedServiceElementVirtual = object;

export interface NumberedServiceElementInstanceMethods {}
export type NumberedServiceElementQueryHelpers = object;
export interface NumberedServiceElementDocument
	extends ApplySchemaOptions<
		ObtainDocumentType<
			NumberedServiceElementDocument,
			NumberedServiceElementI,
			ResolveSchemaOptions<NumberedServiceElementSchemaOptions>
		>,
		ResolveSchemaOptions<NumberedServiceElementSchemaOptions>
	> {}
export interface NumberedServiceElementHydratedDocument
	extends HydratedDocument<
		FlatRecord<NumberedServiceElementDocument>,
		NumberedServiceElementInstanceMethods & NumberedServiceElementVirtual,
		NumberedServiceElementQueryHelpers
	> {}

export interface NumberedServiceElementStaticMethods {
	// custom static methods here
}
export interface NumberedServiceElementSchemaOptions {
	_id: true;
	timestamps: true;
}
export interface NumberedServiceElementModel
	extends Model<
			NumberedServiceElementI,
			NumberedServiceElementQueryHelpers,
			NumberedServiceElementInstanceMethods,
			NumberedServiceElementVirtual,
			NumberedServiceElementHydratedDocument
		>,
		NumberedServiceElementStaticMethods {}
