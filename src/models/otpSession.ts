import crypto from 'node:crypto';

import { Schema, model } from 'mongoose';

import type {
	OTPSessionDocumentI,
	OTPSessionInstanceMethods,
	OTPSessionKindsI,
	OTPSessionModel,
	OTPSessionQueryHelpers,
	OTPSessionSchemaOptions,
	OTPSessionStaticMethods,
	OTPSessionVirtual,
} from '!server/generated/OTPSession';

import userModel from './user';

const required = true;

const kindEnum: OTPSessionKindsI[] = ['resetPassword', 'emailVerification', 'phoneVerification'];
export function generateOTP() {
	return Math.floor(100000 + Math.random() * 999999)
		.toString()
		.substring(0, 6);
}
/* --------------------- Schema --------------------- */
const otpSessionSchema = new Schema<
	OTPSessionDocumentI,
	OTPSessionModel,
	OTPSessionInstanceMethods,
	OTPSessionQueryHelpers,
	OTPSessionVirtual,
	OTPSessionStaticMethods,
	OTPSessionSchemaOptions
>(
	{
		userId: { type: Schema.Types.ObjectId, ref: 'User', required },
		hashedOtp: { type: String, required },
		salt: { type: String, required },
		kind: {
			type: String,
			enum: kindEnum,
			required,
		},
		toValidate: { type: String },
	},
	{ timestamps: true }
);
/* --------------------- Indexes ---------------------  */
otpSessionSchema.index({ createdAt: 1 }, { expireAfterSeconds: 1200 });
/* --------------------- Virtual ---------------------  */

/* --------------------- Hooks ---------------------  */
otpSessionSchema.pre('save', async function (next) {
	try {
		if (this.isNew || this.isModified('hashedOtp')) {
			this.salt = crypto.randomBytes(16).toString('hex');
			this.hashedOtp = await new Promise((resolve, reject) => {
				crypto.pbkdf2(this.hashedOtp, this.salt, 1000, 64, 'sha512', (err, derivedKey) => {
					if (err) return reject(err);
					resolve(derivedKey.toString('hex'));
				});
			});
		}
		next();
	} catch (err) {
		next(err as Error);
	}
});
/* --------------------- Methods ---------------------  */
otpSessionSchema.methods.compareOTP = async function (providedOtp) {
	return new Promise((resolve, reject) => {
		crypto.pbkdf2(providedOtp, this.salt, 1000, 64, 'sha512', (err, derivedKey) => {
			if (err) return reject(err);
			resolve(this.hashedOtp === derivedKey.toString('hex'));
		});
	});
};
/* --------------------- static methods --------------------- */

otpSessionSchema.statics.createRecoverySession = async function (email) {
	const user = await userModel.findOne({ email });
	if (!user) throw new Error('User not found');
	const otp = generateOTP();
	const otpObject: Omit<OTPSessionDocumentI, 'salt'> = {
		userId: user._id,
		hashedOtp: otp,
		kind: 'resetPassword',
	};
	const newOTPSession = await this.create(otpObject);
	return [otp, newOTPSession, user];
};
otpSessionSchema.statics.createValidationSession = async function (email) {
	const user = await userModel.findOne({ email });
	if (!user) throw new Error('User not found');
	const otp = generateOTP();
	const otpObject: Omit<OTPSessionDocumentI, 'salt'> = {
		userId: user._id,
		hashedOtp: otp,
		kind: 'emailVerification',
		toValidate: email,
	};
	const newOTPSession = await this.create(otpObject);
	return [otp, newOTPSession, user];
};

otpSessionSchema.statics.getSession = async function (sessionId, OTPCode) {
	const session = await this.findById(sessionId);
	if (!session) throw new Error('Could not find session');
	const user = await userModel.findById(session.userId);
	if (!user) throw new Error('Could not find user');
	if (!(await session.compareOTP(OTPCode))) throw new Error('OTP Invalid');
	return [session, user];
};
otpSessionSchema.statics.getNecessarySession = async function (sessionId, OTPCode, replaceUser = true) {
	const [session, user] = await this.getSession(sessionId, OTPCode);
	return [session, user.toNecessaryUser(replaceUser)];
};
otpSessionSchema.statics.resetPassword = async function (sessionId, password, OTPCode) {
	const [session, user] = await this.getSession(sessionId, OTPCode);
	user.password = password;
	await Promise.all([user.save(), session.deleteOne()]);
};
otpSessionSchema.statics.validateEmail = async function (sessionId, OTPCode) {
	const [session, user] = await this.getSession(sessionId, OTPCode);
	if (!session.toValidate) throw new Error('No email to validate');
	user.emailValidated = true;
	await Promise.all([user.save(), session.deleteOne()]);
	return user.toOptimizedObject();
};

/* --------------------- Generate Model --------------------- */
const otpSessionModel = model<OTPSessionDocumentI, OTPSessionModel, OTPSessionQueryHelpers>(
	'OTPSession',
	otpSessionSchema
);
export default otpSessionModel;
