import crypto from 'node:crypto';
import mongoose, { Schema, model } from 'mongoose';
import type { Expression } from 'mongoose';

import { passwordSchema } from '^common/elements';

import type {
	UserD,
	UserInstanceMethods,
	UserModel,
	UserQueryHelpers,
	UserSchemaOptions,
	UserStaticMethods,
	UserVirtual,
} from '!server/generated/user';

import { Jwt } from '&server/jwt';
import { compareHashes, hashPassword } from '@common/utils/password';
import type { AnyExpression } from 'mongoose';
import { replaceEmail, replacePhone } from '@server/utils';

const required = true;
const unique = true;
/* --------------------- Schema --------------------- */
const userSchema = new Schema<
	UserD,
	UserModel,
	UserInstanceMethods,
	UserQueryHelpers,
	UserVirtual,
	UserStaticMethods,
	UserSchemaOptions
>(
	{
		email: {
			type: String,
			required,
			unique,
			match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Email is invalid'],
		},
		firstName: {
			type: String,
			required,
		},
		lastName: {
			type: String,
			required,
		},
		password: { type: String, required },
		salt: { type: String },
		phone: { type: String },
		lastLogin: { type: Date, default: Date.now },
		enabled: { type: Boolean, default: true },
		emailValidated: { type: Boolean, default: false },
		isAdmin: { type: Boolean, default: false },
	},
	{ timestamps: true }
);
/* --------------------- Virtual ---------------------  */

/* --------------------- Hooks ---------------------  */

userSchema.pre('save', async function (next) {
	try {
		if (this.isNew || this.isModified('password')) {
			passwordSchema('en').parse(this.password);
			this.salt = crypto.randomBytes(16).toString('hex');

			// Use the async pbkdf2 version
			this.password = await new Promise((resolve, reject) => {
				crypto.pbkdf2(this.password, this.salt, 1000, 64, 'sha512', (err, derivedKey) => {
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
/**
 *
 * @param password password to compare with
 * @returns whether the password is correct or not
 */
userSchema.methods.comparePassword = async function (password) {
	return new Promise((resolve, reject) => {
		crypto.pbkdf2(password, this.salt, 1000, 64, 'sha512', (err, derivedKey) => {
			if (err) return reject(err);
			resolve(this.password === derivedKey.toString('hex'));
		});
	});
};
userSchema.methods.comparePublicKey = async function (publicKey, salt) {
	const user = this.toObject();
	return await compareHashes(publicKey, `${user.email}/pk/${user.createdAt}`, salt);
};
userSchema.methods.generatePublicKey = async function () {
	const user = this.toObject();
	const { password, salt } = await hashPassword(`${user.email}/pk/${user.createdAt}`);
	return { ppk: password, salt };
};

userSchema.methods.toOptimizedObject = function () {
	return {
		email: this.email,
		firstName: this.firstName,
		lastName: this.lastName,
		phone: this.phone,
		_id: this._id.toString(),
		enabled: this.enabled,
		emailValidated: this.emailValidated,
		lastLogin: this.lastLogin,
		isAdmin:this.isAdmin
	};
};
userSchema.methods.toPublicUser = function () {
	return this.toOptimizedObject();
};
userSchema.methods.generateAuthToken = async function () {
	const nowDate = Math.floor(Date.now() / 1000);
	const { ppk, salt } = await this.generatePublicKey();
	return Jwt.sign({
		id: this._id.toString(),
		issAt: nowDate,
		issBy: 'app',
		pk: ppk,
		salt,
	});
};

userSchema.methods.toNecessaryUser = function (replace = true) {
	const user = this.toOptimizedObject();
	return {
		...user,
		email: replace ? replaceEmail(user.email) : user.email,
		phone: replace ? replacePhone(user.phone) : user.phone,
	};
};

/* --------------------- Query Helpers --------------------- */

/* --------------------- static methods --------------------- */

userSchema.statics.createUser = async function (user) {
	const newUser = new this(user);
	await newUser.save();
	return newUser;
};

userSchema.statics.loginGoogleUser = async function (googleId) {
	const user = await this.findOne({ 'apps.google.id': googleId });
	if (!user) throw new Error('User not found');
	if (!user.enabled) throw new Error('User is not enabled');
	return user;
};
userSchema.statics.findByCredentials = async function (email, password) {
	const user = await this.findOne({ email });
	if (!user) throw new Error('Invalid credentials');
	const isMatch = await user.comparePassword(password);
	if (!isMatch) throw new Error('Invalid credentials');
	user.lastLogin = new Date();
	await user.save();
	return user;
};
userSchema.statics.getUserFromToken = async payload => {
	const user = await userModel.findById(payload.id);
	// verify if user exists and the public key is correct
	if (!user) throw new Error('User not found');
	if (!(await user.comparePublicKey(payload.pk, payload.salt))) throw new Error('Invalid Public Key');
	return user;
};
const CustomerTableProjection: Partial<Record<keyof UserD, AnyExpression | Expression>> = {
	_id: 1,
	createdAt: 1,
	updatedAt: 1,
	firstName: 1,
	lastName: 1,
	phone: 1,
	enabled: 1,
	email: 1,
	lastLogin: 1,
};
userSchema.statics.getAdminsTableData = async function (query, { additionalFilter = {} } = { additionalFilter: {} }) {
	const { page = 1, limit = 100, sort = 'createdAt', sortDir = 'asc' } = query;

	const list = (
		await this.aggregate<ListOf<UserD>>([
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
						{ $project: CustomerTableProjection },
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
const userModel = (mongoose.models.User as UserModel) || model<UserD, UserModel, UserQueryHelpers>('User', userSchema);
export default userModel;
