import type {
	ApplySchemaOptions,
	FilterQuery,
	FlatRecord,
	HydratedDocument,
	Model,
	ObtainDocumentType,
	/* QueryWithHelpers, */
	ResolveSchemaOptions,
	Types,Document
} from 'mongoose';

export type SupportRequestVirtual = object;
export interface SupportRequestD extends SupportRequestI , Document<Types.ObjectId> {}
export interface SupportRequestInstanceMethods {
	toOptimizedObject: (this: SupportRequestHydratedDocument) => PublicSupportRequestI;
}
export type SupportRequestQueryHelpers = object;
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface SupportRequestDocument
	extends ApplySchemaOptions<
		ObtainDocumentType<
			SupportRequestDocument,
			SupportRequestI,
			ResolveSchemaOptions<SupportRequestSchemaOptions>
		>,
		ResolveSchemaOptions<SupportRequestSchemaOptions>
	> {}
export type SupportRequestHydratedDocument = HydratedDocument<
	FlatRecord<SupportRequestDocument>,
	SupportRequestInstanceMethods & SupportRequestVirtual,
	SupportRequestQueryHelpers
>;

export interface SupportRequestStaticMethods {
	// custom static methods here
	getSupportRequestTableData: (
		this: SupportRequestModel,
		query: SortableQuerySearchI<SupportSortableFields>,
		additionalFilter?: FilterQuery<PublicSupportRequestI>
	) => Promise<ListOf<PublicSupportRequestI>>;
}
export interface SupportRequestSchemaOptions {
	timestamps: true;
}
export interface SupportRequestModel
	extends Model<
			SupportRequestD,
			SupportRequestQueryHelpers,
			SupportRequestInstanceMethods,
			SupportRequestVirtual,
			SupportRequestHydratedDocument
		>,
		SupportRequestStaticMethods {}
