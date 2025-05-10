import fs from 'node:fs';
import { pino } from 'pino';

import { OI_LOGS_DIR } from '&server/env';

if (!fs.existsSync(OI_LOGS_DIR)) {
	fs.mkdirSync(OI_LOGS_DIR);
}

export const fLogger = pino(
	{ name: 'fy-logs-file' },
	pino.destination({
		dest: `${OI_LOGS_DIR}/logs.log`,
		append: true,
		sync: true,
	})
);
