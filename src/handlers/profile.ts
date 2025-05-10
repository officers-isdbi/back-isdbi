import type { Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { handleErrorResponse, handleServiceResponse } from '@server/utils/httpHandlers';
import { ResponseStatus, ServiceResponse } from '@server/utils/serviceResponse';

import type { ERequest } from '!server/E_Express';
import type { UserHydratedDocument } from '!server/generated/user';

export const updatePersonalInformation = async (
	req: ERequest<UserDocumentI, any, ResponseI<UserI>, PersonalInformationI>,
	res: Response<ResponseI<UserI>>
) => {
	const user = req.records!.user as UserHydratedDocument;
	const { firstName, lastName } = req.body;
	user.firstName = firstName;
	user.lastName = lastName;
	try {
		await user.save();
		handleServiceResponse(
			new ServiceResponse<UserI>(
				ResponseStatus.Success,
				'Personal information has been updated',
				user.toOptimizedObject(),
				StatusCodes.OK
			),
			res
		);
	} catch (e) {
		handleErrorResponse(StatusCodes.INTERNAL_SERVER_ERROR, "Personal information couldn't be updated", e, res);
	}
};

export const updatePassword = async (
	req: ERequest<UserDocumentI, any, ResponseI<null>, ChangePasswordI>,
	res: Response<ResponseI<null>>
) => {
	const user = req.records!.user as UserHydratedDocument;
	const { oldPassword, newPassword } = req.body;
	try {
		if (!(await user.comparePassword(oldPassword))) throw new Error('Invalid password');
		user.password = newPassword;
		await user.save();
		handleServiceResponse(
			new ServiceResponse<null>(ResponseStatus.Success, 'Password has been updated', null, StatusCodes.OK),
			res
		);
	} catch (e) {
		handleErrorResponse(StatusCodes.INTERNAL_SERVER_ERROR, "Password couldn't be updated", e, res);
	}
};
/* export const updatePicture = async (
	req: ERequest<UserDocumentI, any, ResponseI<UserI>, { profilePicture?: string }>,
	res: Response<ResponseI<UserI>>
) => {
	const user = req.records!.user as UserHydratedDocument;
	const { profilePicture } = req.body;
	user.profilePicture = profilePicture;
	try {
		await user.save();
		handleServiceResponse(
			new ServiceResponse<UserI>(
				ResponseStatus.Success,
				'Picture has been updated',
				user.toOptimizedObject(),
				StatusCodes.OK
			),
			res
		);
	} catch (e) {
		handleErrorResponse(StatusCodes.INTERNAL_SERVER_ERROR, "Picture couldn't be updated", e, res);
	}
};
 */
