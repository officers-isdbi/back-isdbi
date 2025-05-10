import type { NextFunction, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { OI_TOKEN_NAME } from '&server/env';
import { Jwt } from '&server/jwt';
import { extractAuth } from '@server/utils/cookies';
import { handleServiceResponse } from '@server/utils/httpHandlers';
import { ResponseStatus, ServiceResponse } from '@server/utils/serviceResponse';

import type { ERequest } from '!server/E_Express';
import { getRequestLanguage } from '@server/utils/request';
import userModel from '#server/user';
async function loadLogs(req: ERequest<UserDocumentI | null>) {
	const token = extractAuth(OI_TOKEN_NAME, req);
	if (token) {
		try {
			const payload = Jwt.verify(getRequestLanguage(req), token);
			req.records!.user = await userModel.getUserFromToken(payload);
		} catch (e) {
			const serviceResponse = new ServiceResponse<ErrorResponseI>(
				ResponseStatus.Failed,
				'Invalid Token',
				{ message: (e as Error).message as string, error: e as Error },
				StatusCodes.BAD_REQUEST
			);
			throw serviceResponse;
		}
	}
}

export const checkLogs = async (req: ERequest<UserDocumentI | null>, res: Response, next: NextFunction) => {
	try {
		await loadLogs(req);
	} catch (e) {
		return handleServiceResponse(e as ServiceResponse<ErrorResponseI>, res);
	}
	return next();
};



export const isLoggedIn = (req: ERequest<UserDocumentI | null>, res: Response, next: NextFunction) => {
	if (req.records!.user) return next();
	const serviceResponse = new ServiceResponse<null>(
		ResponseStatus.Failed,
		"You aren't logged in",
		null,
		StatusCodes.UNAUTHORIZED
	);
	return handleServiceResponse(serviceResponse, res);
};

export const isAdmin = (req: ERequest<UserDocumentI | null>, res: Response, next: NextFunction) => {
	if (req.records!.user?.isAdmin) return next();
	const serviceResponse = new ServiceResponse<null>(
		ResponseStatus.Failed,
		"You aren't an admin",
		null,
		StatusCodes.UNAUTHORIZED
	);
	return handleServiceResponse(serviceResponse, res);
};