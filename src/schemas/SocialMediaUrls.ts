import { Schema } from 'mongoose';

import type {
	SocialMediaUrlsInstanceMethods,
	SocialMediaUrlsModel,
	SocialMediaUrlsQueryHelpers,
	SocialMediaUrlsSchemaOptions,
	SocialMediaUrlsStaticMethods,
	SocialMediaUrlsVirtual,
} from '!server/generated/schemas/SocialMediaUrls';

/* --------------------- Schema --------------------- */
const socialMediaUrlsSchema = new Schema<
	SocialMediaUrlsI,
	SocialMediaUrlsModel,
	SocialMediaUrlsInstanceMethods,
	SocialMediaUrlsQueryHelpers,
	SocialMediaUrlsVirtual,
	SocialMediaUrlsStaticMethods,
	SocialMediaUrlsSchemaOptions
>(
	{
		facebook: { type: String },
		x: { type: String },
		youtube: { type: String },
		instagram: { type: String },
		linkedin: { type: String },
		tiktok: { type: String },
		behance: { type: String },
		pintrest: { type: String },
		discord: { type: String },
		whatsapp: { type: String },
		telegram: { type: String },
		bluesky: { type: String },
		snapchat: { type: String },
		twitch: { type: String },
		eventbrite: { type: String },
		meetup: { type: String },
		mastodon: { type: String },
		thread: { type: String },
		slack: { type: String },
		polywork: { type: String },
		quora: { type: String },
		lemmy: { type: String },
	},
	{ timestamps: false }
);
/* --------------------- Virtual ---------------------  */

/* --------------------- Hooks ---------------------  */

/* --------------------- Methods ---------------------  */
socialMediaUrlsSchema.methods.toOptimizedObject = function () {
	return this.toObject();
};

export { socialMediaUrlsSchema };
