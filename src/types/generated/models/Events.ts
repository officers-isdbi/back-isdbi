/* eslint-disable @typescript-eslint/no-empty-object-type */
import type {
	ApplySchemaOptions,
	Document,
	FilterQuery,
	FlatRecord,
	HydratedDocument,
	Model,
	ObtainDocumentType,
	/* QueryWithHelpers, */
	ResolveSchemaOptions,
	Types,
} from 'mongoose';

export type EventsVirtual = object;
export interface EventsD extends EventsI<Types.ObjectId, Date>, Document<Types.ObjectId> {}
export interface EventsInstanceMethods {
	toOptimizedObject: (this: EventsHydratedDocument) => PublicEventsI;
}
export type EventsQueryHelpers = object;
export interface EventsDocument
	extends ApplySchemaOptions<
		ObtainDocumentType<EventsDocument, EventsI<Types.ObjectId>, ResolveSchemaOptions<EventsSchemaOptions>>,
		ResolveSchemaOptions<EventsSchemaOptions>
	> {}
export type EventsHydratedDocument = HydratedDocument<
	FlatRecord<EventsDocument>,
	EventsInstanceMethods & EventsVirtual,
	EventsQueryHelpers
>;

export interface EventsStaticMethods {
	getEventsTableData: (
		this: EventsModelI,
		query: SortableQuerySearchI<EventsSortableFields>,
		options?: {
			additionalFilter?: FilterQuery<PublicEventsI>;
		}
	) => Promise<ListOf<PublicEventsI>>;
}
export interface EventsSchemaOptions {
	timestamps: true;
}
export interface EventsModelI
	extends Model<EventsD, EventsQueryHelpers, EventsInstanceMethods, EventsVirtual, EventsHydratedDocument>,
		EventsStaticMethods {}
export type EventsToObject = FlatRecord<EventsDocument> & {
	_id: Types.ObjectId;
};
