import mongoose, { type AnyExpression, type Expression, model, Schema } from 'mongoose';

import type {
	EventsD,
	EventsInstanceMethods,
	EventsModelI,
	EventsQueryHelpers,
	EventsSchemaOptions,
	EventsStaticMethods,
	EventsVirtual,
} from '!server/generated/models/Events';
import ImageSchema from '@server/schemas/Image';
import LanguagesContentSchema from '@server/schemas/LanguagesContent';

const required = true;

/* --------------------- Schema --------------------- */
const EventsSchema = new Schema<
	EventsD,
	EventsModelI,
	EventsInstanceMethods,
	EventsQueryHelpers,
	EventsVirtual,
	EventsStaticMethods,
	EventsSchemaOptions
>(
	{
		// schema here
		name: { type: LanguagesContentSchema, required },
		slug: {
			type: String,
			required,
		},
		category: {
			type: Schema.Types.ObjectId,
			ref: 'Category',
		},
		summary: { type: LanguagesContentSchema, required },
		details: { type: LanguagesContentSchema, required },
		startDate: { type: Date, required },
		endDate: { type: Date, required },
		partners: { type: [String], required },
		tags: { type: [String], required },
		images: { type: [ImageSchema], required },
		enabled: { type: Boolean, default: true },
		isPublished: { type: Boolean, default: true },
		label: { type: String },
		thumbnail: {
			type: ImageSchema,
			default: {
				src: '',
				alt: '',
				width: 0,
				height: 0,
			},
		},
	},
	{ timestamps: true }
);
/* --------------------- Virtual ---------------------  */

/* --------------------- Hooks ---------------------  */
/* EventsSchema.pre('save', async function (next) {
	try {
	// hook here
		next();
	} catch (err) {
		next(err as Error);
	}
});
 */
/* --------------------- Methods ---------------------  */
EventsSchema.methods.toOptimizedObject = function () {
	const { _id, createdAt, updatedAt, startDate, endDate,  ...rest } = this.toObject();
	return {
		...rest,
		_id: _id.toString(),
		category: this.category?.toString(),
		createdAt: createdAt.toString(),
		updatedAt: updatedAt.toString(),
		startDate: startDate.toString(),
		endDate: endDate.toString(),
	};
}; /* --------------------- Query Helpers --------------------- */

/* --------------------- static methods --------------------- */

const EventTableProjection: Partial<Record<keyof PublicEventsI, AnyExpression | Expression>> = {
	_id: 1,
	createdAt: 1,
	updatedAt: 1,
	name: 1,
	details: 1,
	slug: 1,
	category: 1,
	images: 1,
	startDate: 1,
	endDate: 1,
	enabled: 1,
	partners: 1,
	tags: 1,
};
EventsSchema.statics.getEventsTableData = async function (query, { additionalFilter = {} } = { additionalFilter: {} }) {
	const { page = 1, limit = 100, sort = 'createdAt', sortDir = 'asc' } = query;

	const list = (
		await this.aggregate<ListOf<PublicEventsI>>([
			{
				$match: {
					...additionalFilter,
				},
			},
			{
				$facet: {
					list: [
						{ $sort: { [sort]: sortDir === 'asc' ? 1 : -1 } },
						{ $skip: (Number(page) - 1) * Number(limit) },
						{ $limit: Number(limit) },
						{
							$lookup: {
								from: 'categories',
								localField: 'category',
								foreignField: '_id',
								as: 'category',
							},
						},
						{
							$unwind: {
								preserveNullAndEmptyArrays: true,
								path: '$category',
							},
						},
						{ $project: EventTableProjection },
					],
					total: [{ $count: 'total' }],
				},
			},
			{
				$project: {
					list: 1,
					total: { $arrayElemAt: ['$total.total', 0] }, // Extract the total number from the array
				},
			},
		])
	)[0];
	if (!list) throw new Error('no data has been found');
	return list;
};

/* --------------------- Indexes --------------------- */
EventsSchema.index({ slug: 1, website: 1 }, { unique: true });
/* --------------------- Generate Model --------------------- */

const eventsModel =
	(mongoose.models.Events as EventsModelI) ||
	model<EventsD, EventsModelI, EventsQueryHelpers>('Events', EventsSchema);
export default eventsModel;
