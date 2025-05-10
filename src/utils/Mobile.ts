import type { Request } from 'express';

import { OI_MOBILE_AGENT } from '&server/env';

const MobileRegex = new RegExp(OI_MOBILE_AGENT, 'i');
export function isMobileRequest(req: Request) {
	return MobileRegex.test(req.headers['user-agent'] || '');
}
