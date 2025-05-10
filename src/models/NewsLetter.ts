import mongoose, { model, Schema, type Types } from 'mongoose';

import type {
	NewsLetterInstanceMethods,
	NewsLetterModel,
	NewsLetterQueryHelpers,
	NewsLetterSchemaOptions,
	NewsLetterStaticMethods,
	NewsLetterVirtual,
} from '!server/generated/models/NewsLetter';
import type { AnyExpression, Expression } from 'mongoose';

const required = true;
const unique = true;
/* --------------------- Schema --------------------- */
const NewsLetterSchema = new Schema<
	NewsLetterI,
	NewsLetterModel,
	NewsLetterInstanceMethods,
	NewsLetterQueryHelpers,
	NewsLetterVirtual,
	NewsLetterStaticMethods,
	NewsLetterSchemaOptions
>(
	{
		// schema here
		
		email: {
			type: String,
			required,
			unique,
		},
		subscribed: {
			type: Boolean,
			default: true,
		},
	},
	{ timestamps: true }
);
/* --------------------- Virtual ---------------------  */

/* --------------------- Hooks ---------------------  */
/* NewsLetterSchema.pre('save', async function (next) {
	try {
	// hook here
		next();
	} catch (err) {
		next(err as Error);
	}
});
 */
/* --------------------- Methods ---------------------  */
NewsLetterSchema.methods.toOptimizedObject = function () {
	const { _id, createdAt, updatedAt,  ...rest } = this.toObject();
	return {
		...rest,
		_id: _id.toString(),
		createdAt: createdAt.toString(),
		updatedAt: updatedAt.toString(),
	};
};
/* --------------------- Query Helpers --------------------- */

/* --------------------- static methods --------------------- */

/* --------------------- Generate Model --------------------- */
const NewsletterTableProjection: Partial<Record<keyof PublicNewsLetterI, AnyExpression | Expression>> = {
	_id: 1,
	createdAt: 1,
	updatedAt: 1,
	email: 1,
	subscribed: 1,
};
NewsLetterSchema.statics.getNewsLetterTableData = async function (query, additionalFilter = {}) {
	const { page = 1, limit = 50, sort = 'createdAt', sortDir = 'asc' } = query;

	const list = (
		await this.aggregate<ListOf<PublicNewsLetterI>>([
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
						{ $project: NewsletterTableProjection },
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
const newsLetterModel =
	(mongoose.models.NewsLetter as NewsLetterModel) ||
	model<NewsLetterI, NewsLetterModel, NewsLetterQueryHelpers>('NewsLetter', NewsLetterSchema);
export default newsLetterModel;
