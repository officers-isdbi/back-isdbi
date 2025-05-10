import type { Request } from 'express';
import type { ParsedQs } from 'qs';


import type { UserHydratedDocument } from '!server/generated/user';

type RequestExtends = UserDocumentI ;

interface RequestExtendsMap<T extends RequestExtends | null = null> {
	records?: {
		user: T extends UserDocumentI ? UserHydratedDocument : null;
	};
}

export interface ERequest<
	Req extends RequestExtends | null = null,
	// biome-ignore lint/complexity/noBannedTypes: fine for here
	Params = {},
	ResBody = any,
	ReqBody = any,
	// biome-ignore lint/complexity/noBannedTypes: fine for here
	ReqQuery = {},
	Locals extends Record<string, any> = Record<string, any>,
> extends Request<Params, ResBody, ReqBody, ReqQuery & ParsedQs, Locals>,
		RequestExtendsMap<Req> {}
