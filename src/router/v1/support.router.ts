import { getSupports, updateSupportState } from '@server/handlers/support';
import { Router } from 'express';
// import { validateRequest } from '@server/utils/httpHandlers';

const supportsRouter = Router();

supportsRouter.route('/').get(getSupports);
supportsRouter.route('/:supportId/state').put(updateSupportState);

export default supportsRouter;
