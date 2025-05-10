import type {
	ApplySchemaOptions,
	Document,
	FilterQuery,
	FlatRecord,
	HydratedDocument,
	Model,
	ObtainDocumentType,
	/* QueryWithHelpers, */
	ResolveSchemaOptions,
	Types,
} from 'mongoose';

export type UserVirtual = object;
export interface UserD extends UserDocumentI<Types.ObjectId, NativeDate>, Document<Types.ObjectId> {}
export interface UserInstanceMethods {
	comparePassword: (this: UserHydratedDocument, password: string) => Promise<boolean>;
	toNecessaryUser: (this: UserHydratedDocument, replace?: boolean) => UserI;
	toOptimizedObject: (this: UserHydratedDocument) => PublicUserI
	toPublicUser: (this: UserHydratedDocument) => PublicUserI;
	comparePublicKey: (this: UserHydratedDocument, publicKey: string, salt: string) => Promise<boolean>;
	generatePublicKey: (this: UserHydratedDocument) => Promise<{ ppk: string; salt: string }>;
	generateAuthToken: (this: UserHydratedDocument) => Promise<string>;
}
/* QueryWithHelpers<UserHydratedDocument | null, UserHydratedDocument, UserQueryHelpers, UserD,'findOne' >; */
export type UserQueryHelpers = object;
export interface UserDocument
	extends ApplySchemaOptions<
		ObtainDocumentType<UserDocument, UserD, ResolveSchemaOptions<UserSchemaOptions>>,
		ResolveSchemaOptions<UserSchemaOptions>
	> {}
export interface UserHydratedDocument
	extends HydratedDocument<FlatRecord<UserDocument>, UserInstanceMethods & UserVirtual, UserQueryHelpers> {}

export interface UserStaticMethods {
	// custom static methods here
	createUser: (this: UserModel, user: UserI) => Promise<UserHydratedDocument>;
	findByCredentials: (this: UserModel, email: string, password: string) => Promise<UserHydratedDocument>;
	getUserFromToken: (this: UserModel, payload: JWT_Payload) => Promise<UserHydratedDocument>;
	getAdminsTableData: (
		this: UserModel,
		query: SortableQuerySearchI<UserSortableFields>,
		options?: {
			additionalFilter?: FilterQuery<UserDocumentI>;
		}
	) => Promise<ListOf<UserD>>;
}
export interface UserSchemaOptions {
	timestamps: true;
}
export interface UserModel
	extends Model<UserD, UserQueryHelpers, UserInstanceMethods, UserVirtual, UserHydratedDocument>,
		UserStaticMethods {}
