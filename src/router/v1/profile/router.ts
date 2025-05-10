import { Router } from 'express';

import {
	updatePassword,
	updatePersonalInformation,
	// updatePicture,
} from '@server/handlers/profile';
import { checkLogs, isLoggedIn } from '@server/middleware/auth';
// TODO: add request validation
const profileRouter = Router();
profileRouter.use(checkLogs, isLoggedIn);

profileRouter.route('/personal-information').put(updatePersonalInformation);

profileRouter.route('/password').put(updatePassword);
//profileRouter.route('/picture').put(updatePicture);

export default profileRouter;
