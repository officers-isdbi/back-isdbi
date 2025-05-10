import { OI_JWT_PayloadSchema } from '^server/jwt';

import { JWT } from '@server/utils/JWT';

import { OI_JWT_SECRET } from './env';

export const Jwt = new JWT<JWT_Payload>(OI_JWT_SECRET, OI_JWT_PayloadSchema);
