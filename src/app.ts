import { OI_CORS_ORIGIN, OI_PUBLIC_CASH_AGE, isDev, isProd, isTest } from '@server/config/env';
import { defaultErrorRequestHandler, unexpectedRequest } from '@server/middleware/errorHandler';
import rateLimiter from '@server/middleware/rateLimiter';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { type Express } from 'express';
import helmet from 'helmet';
import morgan from 'morgan';

import type { ERequest } from '!server/E_Express';

import path from 'node:path';
import Routing from './router/v1';
//import Routing1_1 from './router/v1.1';

const app: Express = express();

// Set the application to trust the reverse proxy
app.set('trust proxy', true);

// health check for render
app.get('/healthz', (_req, res) => {
	res.status(200).send('OK');
});
// Set the public directory
app.use(
	'/public',
	express.static(path.join(__dirname, './public'), {
		maxAge: OI_PUBLIC_CASH_AGE,
		immutable: true,
	})
);
app.get('/favicon.ico', (_req, res) => res.sendFile(path.join(__dirname, './public/favicon.ico')));

// Middlewares
if (isDev || isTest) {
	app.use(morgan('dev'));
	// Swagger UI
}
const originRegEx = new RegExp(OI_CORS_ORIGIN);
app.use(
	cors({
		origin: (requestOrigin, callback) => {
			if (!requestOrigin) return callback(new Error('no origin provided'));
			const isValid = originRegEx.test(requestOrigin);
			if (isValid) return callback(null, requestOrigin);
			return callback(new Error('no a valid origin'), requestOrigin);
		},
		credentials: true,
	})
);
app.use(helmet());

if (isProd || isTest) app.use(rateLimiter);

// Route the app
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use((req: ERequest, _res, next) => {
	req.records = { user: null };
	next();
});
app.use('/api/v1', Routing);
//app.use('/api/v1.1', Routing1_1);

app.use(unexpectedRequest);
// Error handlers
app.use(defaultErrorRequestHandler);

export default app;
