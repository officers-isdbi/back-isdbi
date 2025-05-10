import type { Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { handleErrorResponse, handleServiceResponse } from '@server/utils/httpHandlers';
import { ResponseStatus, ServiceResponse, ServiceResponseList } from '@server/utils/serviceResponse';

import type { ERequest } from '!server/E_Express';

import type { UserD } from '!server/generated/user';
import { emailQueueService } from '@server/services';
import EmailQueueService from '@server/services/EmailQueue';
import { generatePassword } from '@server/utils/password';
import { getRequestLanguage } from '@server/utils/request';
import adminModel from '#server/user';

export const getAdminById = async (
	req: ERequest<null, { adminId: string }, ResponseI<UserI>>,
	res: Response<ResponseI<UserI>>
) => {
	const adminId = req.params.adminId;
	try {
		const admin = await adminModel.findById(adminId).select('-password');

		if (!admin)
			return handleErrorResponse(StatusCodes.NOT_FOUND, 'Admin not found', new Error('Admin not found'), res);

		handleServiceResponse(
			new ServiceResponse<UserI>(
				ResponseStatus.Success,
				'Admin fetched successfully',
				admin.toOptimizedObject(),
				StatusCodes.OK
			),
			res
		);
	} catch (e) {
		handleErrorResponse(StatusCodes.INTERNAL_SERVER_ERROR, "Couldn't fetch admin", e, res);
	}
};

export const getAdmins = async (
	req: ERequest<
		null,
		any,
		ResponseI<ListOf<UserD>>,
		any,
		SortableQuerySearchI<UserSortableFields> & { enabled?: string }
	>,
	res: Response<ResponseI<ListOf<UserD>>>
) => {
	try {
		const list = await adminModel.getAdminsTableData(req.query, {
			additionalFilter: req.query.enabled ? { enabled: req.query.enabled === 'true' } : {},
		});
		if (!list) throw new Error('Admins not found');
		handleServiceResponse(
			new ServiceResponseList<UserD>(ResponseStatus.Success, 'Admins fetched successfully', list, StatusCodes.OK),
			res
		);
	} catch (e) {
		handleErrorResponse(StatusCodes.INTERNAL_SERVER_ERROR, "Couldn't fetch admins", e, res);
	}
};

export const createAdmin = async (
	req: ERequest<UserDocumentI, any, ResponseI<UserI>, UserI>,
	res: Response<ResponseI<UserI>>
) => {
	// const user = req.records!.user!;
	try {
		const adminFound = await adminModel.exists({ email: req.body.email });
		if (adminFound) throw new Error('Email already exists!');

		const password = generatePassword();

		// Form a DB payload
		const newAdmin: RegistrationUserI = { ...req.body, password, confirmPassword: password };
		// Update the DB
		const adminD = await adminModel.create(newAdmin);
		// todo: send email with key
		await emailQueueService.sendEmail(
			EmailQueueService.WelcomeAdminEmail(adminD.toNecessaryUser(false), getRequestLanguage(req), password)
		);
		handleServiceResponse(
			new ServiceResponse<UserI>(
				ResponseStatus.Success,
				'Admin created successfully',
				adminD.toOptimizedObject(),
				StatusCodes.OK
			),
			res
		);
	} catch (e) {
		handleErrorResponse(StatusCodes.INTERNAL_SERVER_ERROR, "Couldn't create admin", e, res);
	}
};
export const updateAdmin = async (
	req: ERequest<UserDocumentI, { adminId: string }, ResponseI<null>, Partial<UserI>>,
	res: Response<ResponseI<null>>
) => {
	// const user = req.records!.user!;
	try {
		const adminFound = await adminModel.findById(req.params.adminId);
		if (!adminFound) throw new Error('Admin not found');

		//const password = generatePassword();

		// Form a DB payload
		const { email, firstName, lastName, phone } = req.body;
		if (email) adminFound.email = email;
		if (firstName) adminFound.firstName = firstName;
		if (lastName) adminFound.lastName = lastName;
		if (phone) adminFound.phone = phone;

		await adminFound.save();

		handleServiceResponse(
			new ServiceResponse<null>(ResponseStatus.Success, 'Admin created successfully', null, StatusCodes.OK),
			res
		);
	} catch (e) {
		handleErrorResponse(StatusCodes.INTERNAL_SERVER_ERROR, "Couldn't create admin", e, res);
	}
};
export const resetAdminPassword = async (
	req: ERequest<UserDocumentI, { adminId: string }, ResponseI<null>>,
	res: Response<ResponseI<null>>
) => {
	// const user = req.records!.user!;
	try {
		const adminFound = await adminModel.findById(req.params.adminId);
		if (!adminFound) throw new Error('Admin not found');

		const password = generatePassword();

		// Form a DB payload
		adminFound.password = password;

		await adminFound.save();
		await emailQueueService.sendEmail(
			EmailQueueService.ResetedPasswordEmail(adminFound.toNecessaryUser(false), getRequestLanguage(req), password)
		);
		handleServiceResponse(
			new ServiceResponse<null>(ResponseStatus.Success, 'Admin created successfully', null, StatusCodes.OK),
			res
		);
	} catch (e) {
		handleErrorResponse(StatusCodes.INTERNAL_SERVER_ERROR, "Couldn't create admin", e, res);
	}
};

export const updateAdminState = async (
	req: ERequest<null, { adminId: string }, ResponseI<null>, Pick<PublishableStatesI, 'enabled'>>,
	res: Response<ResponseI<null>>
) => {
	try {
		const admin = await adminModel
			.updateOne(
				{
					_id: req.params.adminId,
				},
				{
					$set: req.body,
				},
				{
					new: true,
				}
			)
			.lean();
		if (admin.modifiedCount === 0) throw new Error('Admin not found');
		handleServiceResponse(
			new ServiceResponse<null>(ResponseStatus.Success, 'Admin updated successfully', null, StatusCodes.OK),
			res
		);
	} catch (e) {
		handleErrorResponse(StatusCodes.INTERNAL_SERVER_ERROR, "Couldn't update admin", e, res);
	}
};



export const deleteAdmins = async (
	req: ERequest<null, any, ResponseI<null>, { adminIds: string[] }>,
	res: Response<ResponseI<null>>
) => {
	try {
		const admins = await adminModel.find({
			_id: {
				$in: req.body.adminIds,
			},
		});
		if (admins.length === 0) throw new Error('Admins not found');
		if (admins.length !== req.body.adminIds.length) throw new Error('Some admins not found ');

		await adminModel.deleteMany({
			_id: {
				$in: req.body.adminIds,
			},
		});
		handleServiceResponse(
			new ServiceResponse<null>(ResponseStatus.Success, 'Admins deleted successfully', null, StatusCodes.OK),
			res
		);
	} catch (e) {
		handleErrorResponse(StatusCodes.INTERNAL_SERVER_ERROR, "Couldn't delete admins", e, res);
	}
};
