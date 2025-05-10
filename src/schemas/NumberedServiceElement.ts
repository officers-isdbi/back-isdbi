import { Schema } from 'mongoose';

import type {
	NumberedServiceElementInstanceMethods,
	NumberedServiceElementModel,
	NumberedServiceElementQueryHelpers,
	NumberedServiceElementSchemaOptions,
	NumberedServiceElementStaticMethods,
	NumberedServiceElementVirtual,
} from '!server/generated/schemas/NumberedServiceElement';
import LanguagesContentSchema from './LanguagesContent';

const required = true;

/* --------------------- Schema --------------------- */
const NumberedServiceElementSchema = new Schema<
	NumberedServiceElementI,
	NumberedServiceElementModel,
	NumberedServiceElementInstanceMethods,
	NumberedServiceElementQueryHelpers,
	NumberedServiceElementVirtual,
	NumberedServiceElementStaticMethods,
	NumberedServiceElementSchemaOptions
>(
	{
		// schema here
		title: { type: LanguagesContentSchema, required },
		description: { type: LanguagesContentSchema, required },
		count: { type: Number, required },
	},
	{ timestamps: true }
);
/* --------------------- Virtual ---------------------  */

/* --------------------- Hooks ---------------------  */

/* --------------------- Methods ---------------------  */

export default NumberedServiceElementSchema;
