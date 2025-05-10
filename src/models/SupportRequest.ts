import mongoose, { model, Schema, type Types } from 'mongoose';

import type {
	SupportRequestD,
	SupportRequestInstanceMethods,
	SupportRequestModel,
	SupportRequestQueryHelpers,
	SupportRequestSchemaOptions,
	SupportRequestStaticMethods,
	SupportRequestVirtual,
} from '!server/generated/models/SupportRequest';
import type { AnyExpression, Document, Expression } from 'mongoose';
const required = true;

/* --------------------- Schema --------------------- */
const SupportRequestSchema = new Schema<
	SupportRequestD,
	SupportRequestModel,
	SupportRequestInstanceMethods,
	SupportRequestQueryHelpers,
	SupportRequestVirtual,
	SupportRequestStaticMethods,
	SupportRequestSchemaOptions
>(
	{
		// schema here
		customerName: { type: String, required },
		email: { type: String, required },
		subject: { type: String, required },
		status: { type: String, default: 'pending', enum: ['pending', 'resolved', 'rejected'] },
		phone: { type: String, required },
		report: { type: String, required },
	},
	{ timestamps: true }
);
/* --------------------- Virtual ---------------------  */

/* --------------------- Hooks ---------------------  */
/* SupportRequestSchema.pre('save', async function (next) {
	try {
	// hook here
		next();
	} catch (err) {
		next(err as Error);
	}
});
 */
/* --------------------- Methods ---------------------  */
SupportRequestSchema.methods.toOptimizedObject = function () {
	const { _id, createdAt, updatedAt,  ...rest } = this.toObject();
	return {
		...rest,
		_id: _id.toString(),
		createdAt: createdAt.toString(),
		updatedAt: updatedAt.toString(),
	};
}; /* --------------------- Query Helpers --------------------- */

/* --------------------- static methods --------------------- */
const SupportRequestTableProjection: Partial<Record<keyof PublicSupportRequestI, AnyExpression | Expression>> = {
	_id: 1,
	createdAt: 1,
	updatedAt: 1,
	email: 1,
	customerName: 1,
	phone: 1,
	report: 1,
	status: 1,
	subject: 1,
};
SupportRequestSchema.statics.getSupportRequestTableData = async function (query, additionalFilter = {}) {
	const { page = 1, limit = 50, sort = 'createdAt', sortDir = 'asc' } = query;

	const list = (
		await this.aggregate<ListOf<PublicSupportRequestI>>([
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
						{ $project: SupportRequestTableProjection },
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
/* --------------------- Generate Model --------------------- */
const supportRequestModel =
	(mongoose.models.SupportRequest as SupportRequestModel) ||
	model<SupportRequestD, SupportRequestModel, SupportRequestQueryHelpers>(
		'SupportRequest',
		SupportRequestSchema
	);
export default supportRequestModel;
