import type { Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { handleErrorResponse, handleServiceResponse } from '@server/utils/httpHandlers';
import { ResponseStatus, ServiceResponse } from '@server/utils/serviceResponse';

import type { ERequest } from '!server/E_Express';
import supportRequestModel from '#server/SupportRequest';

export const getSupports = async (
	req: ERequest<
		null,
		any,
		ResponseI<ListOf<PublicSupportRequestI>>,
		any,
		SortableQuerySearchI<SupportSortableFields>
	>,
	res: Response<ResponseI<ListOf<PublicSupportRequestI>>>
) => {
	
	try {
		const list = await supportRequestModel.getSupportRequestTableData(req.query, {  });
		if (!list) throw new Error('Support requests not found');
		handleServiceResponse(
			new ServiceResponse<ListOf<PublicSupportRequestI>>(
				ResponseStatus.Success,
				'Support request fetched successfully',
				list,
				StatusCodes.OK
			),
			res
		);
	} catch (e) {
		handleErrorResponse(StatusCodes.INTERNAL_SERVER_ERROR, "Couldn't fetch Support requests", e, res);
	}
};

export const updateSupportState = async (
	req: ERequest<null, { supportId: string }, ResponseI<null>, Pick<SupportRequestI, 'status'>>,
	res: Response<ResponseI<null>>
) => {
	const { supportId } = req.params;
	const { status } = req.body;
	
	try {
		const supportRequest = await supportRequestModel.findOneAndUpdate(
			{ _id: supportId,  },
			{ status },
			{ new: true }
		);
		if (!supportRequest) throw new Error('Support request not found');
		handleServiceResponse(
			new ServiceResponse<null>(
				ResponseStatus.Success,
				'Support request updated successfully',
				null,
				StatusCodes.OK
			),
			res
		);
	} catch (e) {
		handleErrorResponse(StatusCodes.INTERNAL_SERVER_ERROR, "Couldn't update Support request", e, res);
	}
};
