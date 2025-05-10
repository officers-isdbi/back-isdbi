import { Schema } from 'mongoose';

import type {
	SponsorInstanceMethods,
	SponsorModel,
	SponsorQueryHelpers,
	SponsorSchemaOptions,
	SponsorStaticMethods,
	SponsorVirtual,
} from '!server/generated/schemas/Sponsor';
import ImageSchema from './Image';
import LanguagesContentSchema from './LanguagesContent';

const required = true;

/* --------------------- Schema --------------------- */
const SponsorSchema = new Schema<
	SponsorI,
	SponsorModel,
	SponsorInstanceMethods,
	SponsorQueryHelpers,
	SponsorVirtual,
	SponsorStaticMethods,
	SponsorSchemaOptions
>(
	{
		// schema here
		title: { type: LanguagesContentSchema, required },
		link: { type: String, required },
		image: { type: ImageSchema, required },
	},
	{ timestamps: true, _id: true }
);
/* --------------------- Virtual ---------------------  */

/* --------------------- Hooks ---------------------  */

/* --------------------- Methods ---------------------  */

export default SponsorSchema;
