import fs from 'node:fs';
import { pino } from 'pino';

import { OI_LOGS_DIR } from '&server/env';

if (!fs.existsSync(OI_LOGS_DIR)) {
	fs.mkdirSync(OI_LOGS_DIR);
}

export const pLogger = pino(
	{ name: 'fy-logs' },
	pino.destination({
		dest: `${OI_LOGS_DIR}/public.log`,
		append: true,
		sync: true,
	})
);
