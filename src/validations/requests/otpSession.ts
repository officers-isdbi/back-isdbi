import { type MyZodType, z } from '^common/defaultZod';
import { OTPSessionSchema, OTPSessionSendSchema, ResetPasswordSchema } from '^common/models/otpSession';

export const OTPSessionRequestSchema = (locale: LanguagesI) =>
	z.object<MyZodType<OTPSessionShapeI>>({
		// Body doit être vide
		body: OTPSessionSchema(locale),
		query: z.any().refine(query => !query || Object.keys(query).length === 0, {
			message: 'Query doit être vide',
		}),
	});
export const SendOTPSessionSchema = (locale: LanguagesI) =>
	z.object<MyZodType<OTPSessionSendShapeI>>({
		body: OTPSessionSendSchema(locale),
		query: z.any().refine(query => !query || Object.keys(query).length === 0, {
			message: 'Query doit être vide',
		}),
	});
export const SendOTPSessionGetSchema = (locale: LanguagesI) =>
	z.object<MyZodType<OTPSessionSendShapeI>>({
		query: OTPSessionSendSchema(locale),
		body: z.any().refine(query => !query || Object.keys(query).length === 0, {
			message: 'Body doit être vide',
		}),
	});
export const ValidateEmailSchema = (locale: LanguagesI) =>
	z.object<MyZodType<OTPSessionSendShapeI>>({
		query: z.any().refine(query => !query || Object.keys(query).length === 0, {
			message: 'Query doit être vide',
		}),
		body: OTPSessionSendSchema(locale),
	});
export const ResetPasswordRequestSchema = (locale: LanguagesI) =>
	z.object<MyZodType<ResetPasswordShapeI>>({
		body: ResetPasswordSchema(locale),
		query: z.any().refine(query => !query || Object.keys(query).length === 0, {
			message: 'Query doit être vide',
		}),
	});
