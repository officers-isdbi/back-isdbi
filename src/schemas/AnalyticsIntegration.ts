import { Schema } from 'mongoose';

import type {
	AnalyticsIntegrationInstanceMethods,
	AnalyticsIntegrationModel,
	AnalyticsIntegrationQueryHelpers,
	AnalyticsIntegrationSchemaOptions,
	AnalyticsIntegrationStaticMethods,
	AnalyticsIntegrationVirtual,
} from '!server/generated/schemas/AnalyticsIntegration';
import IntegrationSchema from './Integration';

/* --------------------- Schema --------------------- */
const AnalyticsIntegrationSchema = new Schema<
	AnalyticsIntegrationI,
	AnalyticsIntegrationModel,
	AnalyticsIntegrationInstanceMethods,
	AnalyticsIntegrationQueryHelpers,
	AnalyticsIntegrationVirtual,
	AnalyticsIntegrationStaticMethods,
	AnalyticsIntegrationSchemaOptions
>(
	{
		// schema here
		meta: {
			type: IntegrationSchema,
		},
		google_analytics: {
			type: IntegrationSchema,
		},
	},
	{ timestamps: true, _id: false }
);
/* --------------------- Virtual ---------------------  */
/* --------------------- Hooks ---------------------  */
/* --------------------- Methods ---------------------  */
/* --------------------- Exports ---------------------  */
export default AnalyticsIntegrationSchema;
