// types/express/index.d.ts
import type { UserHydratedDocument } from '!server/generated/user';

declare global {
	namespace Express {
		interface Request {
			user?: UserHydratedDocument; // or whatever type you want
		}
	}
}
