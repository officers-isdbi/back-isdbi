import { Schema } from 'mongoose';

import type {
	LanguagesContentInstanceMethods,
	LanguagesContentModel,
	LanguagesContentQueryHelpers,
	LanguagesContentSchemaOptions,
	LanguagesContentStaticMethods,
	LanguagesContentVirtual,
} from '!server/generated/schemas/LanguagesContent';
const required = true;
/* --------------------- Schema --------------------- */
const LanguagesContentSchema = new Schema<
	LanguagesContentI,
	LanguagesContentModel,
	LanguagesContentInstanceMethods,
	LanguagesContentQueryHelpers,
	LanguagesContentVirtual,
	LanguagesContentStaticMethods,
	LanguagesContentSchemaOptions
>(
	{
		// schema here
		en: { type: String, required },
		//ar: { type: String, required },
		fr: { type: String, required },
	},
	{ timestamps: false, _id: false }
);
/* --------------------- Virtual ---------------------  */

/* --------------------- Hooks ---------------------  */

/* --------------------- Methods ---------------------  */

/* --------------------- Exports ---------------------  */
export default LanguagesContentSchema;
