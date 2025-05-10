import type { Response } from 'express';

import type { ERequest } from '!server/E_Express';
import { OI_COOKIES_EXPIRE_IN } from '&server/env';

// import { isMobileRequest } from './Mobile';

export function clearToken(tokenName: string, res: Response) {
	res.cookie(tokenName, '', {
		sameSite: 'none',
		secure: true,
		httpOnly: true,
		expires: new Date(1),
	});
}
export function setToken(tokenName: string, token: string, res: Response, stay = false) {
	res.cookie(tokenName, token, {
		sameSite: 'none',
		secure: true,
		httpOnly: true,
		...(stay ? { expires: new Date(new Date().getTime() + OI_COOKIES_EXPIRE_IN) } : {}),
	});
}
export function extractAuth(tokenName: string, req: ERequest): string | undefined {
	/* 	const isMobileApp = isMobileRequest(req);
	if (isMobileApp) {
		const authHeader = req.headers['authorization'];
		if (authHeader && authHeader.startsWith('Bearer ')) return authHeader.slice(7);
	} else { */
	return req.cookies[tokenName];
	/* } */
}
