import type {
	ApplySchemaOptions,
	FilterQuery,
	FlatRecord,
	HydratedDocument,
	Model,
	ObtainDocumentType,
	/* QueryWithHelpers, */
	ResolveSchemaOptions,
	Types,
} from 'mongoose';

export type NewsLetterVirtual = object;

export interface NewsLetterInstanceMethods {
	toOptimizedObject: (this: NewsLetterHydratedDocument) => PublicNewsLetterI;
}
export type NewsLetterQueryHelpers = object;
export interface NewsLetterDocument
	extends ApplySchemaOptions<
		ObtainDocumentType<
			NewsLetterDocument,
			NewsLetterI,
			ResolveSchemaOptions<NewsLetterSchemaOptions>
		>,
		ResolveSchemaOptions<NewsLetterSchemaOptions>
	> {}
export interface NewsLetterHydratedDocument
	extends HydratedDocument<
		FlatRecord<NewsLetterDocument>,
		NewsLetterInstanceMethods & NewsLetterVirtual,
		NewsLetterQueryHelpers
	> {}

export interface NewsLetterStaticMethods {
	// custom static methods here
	getNewsLetterTableData: (
		this: NewsLetterModel,
		query: SortableQuerySearchI<NewsLetterSortableFields>,
		additionalFilter?: FilterQuery<PublicNewsLetterI>
	) => Promise<ListOf<PublicNewsLetterI>>;
}
export interface NewsLetterSchemaOptions {
	timestamps: true;
}
export interface NewsLetterModel
	extends Model<
			NewsLetterI,
			NewsLetterQueryHelpers,
			NewsLetterInstanceMethods,
			NewsLetterVirtual,
			NewsLetterHydratedDocument
		>,
		NewsLetterStaticMethods {}
