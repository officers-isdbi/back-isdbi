import { resolvePath } from '@server/utils/resolvePath';
import dotenv from 'dotenv';
import { url, bool, cleanEnv, email, host, /* makeValidator, */ num, port, str } from 'envalid';
//import { Types, isObjectIdOrHexString } from 'mongoose';
import { cleanOptions, displayEnvironments } from '../utils/env';

dotenv.config();

/* const mongoIdValidator = makeValidator(input => {
	if (!isObjectIdOrHexString(input)) {
		throw new Error('Invalid MongoDB ObjectId');
	}
	return new Types.ObjectId(input); // Return the validated ObjectId as a string
}); */

const env = cleanEnv(
	process.env,
	{
		// Node Configuration
		NODE_ENV: str({
			default: 'production',
			devDefault: 'development',
			choices: ['development', 'test', 'production'],
		}),
		OI_SHUTDOWN_TIMEOUT: num({
			default: 10000,
			devDefault: 10000,
			desc: 'The maximum time in milliseconds to wait for the server to close all connections before it is forcefully shutdown.',
			docs: 'https://nodejs.org/api/http.html#http_server_close_callback',
			example: '10000',
		}),
		/* OI_DEV_ROLE_ID: mongoIdValidator({
			desc: 'The id of the dev role that can manage the website and the server deployed',
			example: '677000000000000000000000',
		}), */
		OI_COOKIES_EXPIRE_IN: num({
			default: 1000 * 60 * 60 * 24 * 15, // 15 days
			devDefault: 1000 * 60 * 60 * 24 * 15, // 15 days
			desc: 'The time in milliseconds for the cookies to expire.',
			docs: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies',
			example: '2592000000',
		}),
		// Server Configuration
		OI_HOST: host({
			default: 'localhost',
			devDefault: 'localhost',
			desc: 'The host to bind the server to.',
			docs: 'https://nodejs.org/api/http.html#http_server_listen',
			example: 'localhost',
		}),
		PORT: port({
			default: 3000,
			devDefault: process.env.NODE_ENV === 'test' ? 3110 : /* istanbul ignore next */ 49544,
			desc: 'The port to bind the server to.',
			docs: 'https://nodejs.org/api/http.html#http_server_listen',
			example: '3000',
		}),
		OI_CORS_ORIGIN: str({
			devDefault: 'http://localhost:*',
			desc: 'The origin to allow CORS requests.',
			docs: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS',
			example: 'http://localhost:*',
		}),
		// Models settings
		OI_EXPIRE_IN_SECONDS: num({
			default: 300, // 5 minutes
			devDefault: 900, // 15 minutes
			desc: 'The time in seconds for the token to expire.',
			docs: 'https://jwt.io/',
		}),

		// Rate limit
		OI_COMMON_RATE_LIMIT_MAX_REQUESTS: num({
			default: 50,
			devDefault: 100,
			desc: 'The maximum number of requests to allow in the window.',
			docs: 'https://www.npmjs.com/package/express-rate-limit',
			example: '20',
		}),
		OI_COMMON_RATE_LIMIT_WINDOW_MS: num({
			default: 15 * 60 * 1000,
			devDefault: 15 * 60 * 1000,
			desc: 'The time in milliseconds for the window.',
			docs: 'https://www.npmjs.com/package/express-rate-limit',
			example: '900000',
		}),

		// MongoDB Configuration
		OI_MONGODB_DB_URI_WITHOUT_CREDENTIALS: str({
			devDefault: 'mongodb://localhost:27017',
			desc: 'The URI of the MongoDB database without credentials.',
			docs: 'https://www.npmjs.com/package/mongoose',
			example: 'mongodb://localhost:27017',
		}),
		/* OI_MONGODB_DB_HOST: host({
			devDefault: 'localhost',
			desc: 'The host of the MongoDB database.',
			docs: 'https://www.npmjs.com/package/mongoose',
			example: 'localhost',
		}),
		OI_MONGODB_DB_PORT: port({
			devDefault: 27017,
			desc: 'The port of the MongoDB database.',
			docs: 'https://www.npmjs.com/package/mongoose',
			example: '27017',
		}), */
		OI_MONGODB_DB_DATABASE: str({
			default: 'app',
			devDefault: process.env.NODE_ENV === 'test' ? 'test-app' : /* istanbul ignore next */ 'app',
			desc: 'The name of the MongoDB database.',
			docs: 'https://www.npmjs.com/package/mongoose',
			example: 'app',
		}),
		OI_MONGODB_DB_USERNAME: str({
			devDefault: undefined,
			desc: 'The username of the MongoDB database.',
			docs: 'https://www.npmjs.com/package/mongoose',
			example: 'root',
		}),
		OI_MONGODB_DB_PASSWORD: str({
			devDefault: undefined,
			desc: 'The password of the MongoDB database.',
			docs: 'https://www.npmjs.com/package/mongoose',
			example: 'root',
		}),
		/* // MONGODB ATLAS
		OI_MONGODB_ATLAS_PRODJECT_ID: str({
			desc: 'The project id of the MongoDB Atlas.',
			docs: 'https://www.npmjs.com/package/mongoose',
			example: 'project-id',
		}),
		OI_MONGODB_ATLAS_CLUSTER: str({
			desc: 'The cluster of the MongoDB Atlas.',
			docs: 'https://www.npmjs.com/package/mongoose',
			example: 'cluster-id',
		}),
		OI_MONGODB_ATLAS_PUBLIC_KEY: str({
			desc: 'The public key of the MongoDB Atlas.',
			docs: 'https://www.npmjs.com/package/mongoose',
			example: 'public-key',
		}),
		OI_MONGODB_ATLAS_PRIVATE_KEY: str({
			desc: 'The private key of the MongoDB Atlas.',
			docs: 'https://www.npmjs.com/package/mongoose',
			example: 'private-key',
		}), */
		// Redis Configuration
		OI_REDIS_DB_HOST: host({
			default: '127.0.0.1',
			devDefault: '127.0.0.1',
			desc: 'The host of the Redis database.',
			docs: 'https://www.npmjs.com/package/redis',
			example: 'localhost',
		}),
		OI_REDIS_DB_PORT: port({
			default: 6379,
			devDefault: 6379,
			desc: 'The port of the Redis database.',
			docs: 'https://www.npmjs.com/package/redis',
			example: '6379',
		}),
		OI_REDIS_DB_PASSWORD: str({
			desc: 'The password of the Redis database.',
			docs: 'https://www.npmjs.com/package/redis',
			example: 'root',
		}),
		// Cloudinary
		OI_CLOUDINARY_CLOUD_NAME: str({
			desc: 'The cloud name of the cloudinary account.',
			docs: 'https://cloudinary.com/',
			example: 'app',
		}),
		OI_CLOUDINARY_API_KEY: str({
			desc: 'The API key of the cloudinary account.',
			docs: 'https://cloudinary.com/',
			example: 'app',
		}),
		OI_CLOUDINARY_API_SECRET: str({
			desc: 'The API secret of the cloudinary account.',
			docs: 'https://cloudinary.com/',
			example: 'app',
		}),
		// Security config
		OI_JWT_SECRET: str({
			desc: 'The secret to sign the JWT.',
			docs: 'https://jwt.io/',
			example: 'my-secret-key',
		}),

		OI_MOBILE_AGENT: str({
			default: 'Dart.+',
			devDefault: 'Dart.+|PostmanRuntime.+',
			desc: 'The regular expression to identify mobile agents.',
			docs: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/User-Agent',
			example: 'Dart.+',
		}),

		// Email configuration
		OI_EMAIL_QUEUE_NAME: str({
			default: 'emailQueue',
			devDefault: 'emailQueue',
			desc: 'The name of the email queue.',
			docs: 'https://www.npmjs.com/package/bull',
			example: 'emailQueue',
		}),
		//  Server fallback

		/* 	OI_MAINTENANCE_PHONE: str({
			default: undefined,
			devDefault: undefined,
			desc: 'The phone to send maintenance notifications.',
			example: '0550000000',
		}), */

		// # Webhooks

		/* OI_MAINTENANCE_DISCORD_WEBHOOK_URL: str({
			desc: 'The Discord webhook URL to send maintenance notifications.',
			example: 'https://discord.com/api/webhooks/...',
			docs: 'https://discord.com/developers/docs/resources/webhook#execute-webhook',
		}),
		OI_MAINTENANCE_DISCORD_WEBHOOK_USERNAME: str({
			default: 'FY FY',
			devDefault: 'FY FY',
			desc: 'The Discord webhook username to send maintenance notifications.',
			example: 'FY FY',
			docs: 'https://discord.com/developers/docs/resources/webhook#execute-webhook',
		}),
		OI_MAINTENANCE_DISCORD_WEBHOOK_AVATAR: str({
			default: 'https://app.net/Logo.svg',
			devDefault: 'https://app.net/Logo.svg',
			desc: 'The Discord webhook avatar to send maintenance notifications.',
			example: 'https://app.net/Logo.svg',
			docs: 'https://discord.com/developers/docs/resources/webhook#execute-webhook',
		}), */
		// public Files and logs
		OI_LOGS_DIR: str({
			default: 'logs',
			devDefault: 'logs',
			desc: 'The directory to store the logs.',
			docs: 'https://www.npmjs.com/package/pino',
			example: 'logs',
		}),
		OI_PUBLIC_FILES_DOMAIN: url({
			devDefault: 'http://localhost:7777',
			desc: 'The url to retrieve the public files.',
			example: 'public',
		}),
		OI_PUBLIC_DIR: str({
			default: 'public',
			devDefault: 'public',
			desc: 'The directory to store the public files.',
			docs: 'https://expressjs.com/en/starter/static-files.html',
			example: 'public',
		}),
		OI_PUBLIC_CASH_AGE: num({
			default: 31536000,
			devDefault: 0,
			desc: 'The maximum age in seconds for the public files.',
			docs: 'https://expressjs.com/en/starter/static-files.html',
			example: '31536000',
		}),
		OI_TOKEN_NAME: str({
			default: 'app-token',
			devDefault: 'app-token',
			desc: 'The name of the token.',
			docs: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies',
			example: 'app-token',
		}),
		// domains and subdomains

		OI_BACK_DOMAIN: url({
			desc: 'The domain of the server.',
			docs: 'https://en.wikipedia.org/wiki/Subdomain',
			example: 'https://accounts-back.app.net',
		}),
		OI_DOMAIN: url({
			desc: 'The domain of the front end.',
			docs: 'https://en.wikipedia.org/wiki/Subdomain',
			example: 'https://accounts.app.net',
		}),
		// Google Configuration
		/* OI_GOOGLE_OAUTH2_CLIENT_ID: str({
			desc: 'Google OAuth2 client ID',
			docs: 'https://developers.google.com/identity/protocols/oauth2',
			example: '1234567890-abcdefghijklmnopqrstuvwxyz.apps.google-user-content.com',
		}),
		OI_GOOGLE_OAUTH2_CLIENT_SECRET: str({
			desc: 'Google OAuth2 client secret',
			docs: 'https://developers.google.com/identity/protocols/oauth2',
			example: 'abcdefghijklmnopqrstuvwxyz',
		}),
		OI_GOOGLE_OAUTH2_REDIRECT_URI: str({
			desc: 'Google OAuth2 redirect URI',
			docs: 'https://developers.google.com/identity/protocols/oauth2',
			example: 'https://app.net/auth/google/callback',
		}),
		OI_GOOGLE_LINK_REDIRECT_URI: str({
			default: 'https://app.net/auth/google/callback',
			devDefault: 'https://app.net/auth/google/callback',
			desc: 'Google OAuth2 redirect URI',
			docs: 'https://developers.google.com/identity/protocols/oauth2',
			example: 'https://app.net/auth/google/callback',
		}), */
		// emails settings
		OI_NOREPLY_EMAIL: email({
			desc: 'The email to send the emails from',
			example: 'no-reply@mail.com',
		}),
		OI_ENABLE_ONLINE: bool({
			default: true,
			devDefault: true,
			desc: 'Enable online mode',
			docs: 'https://app.net',
			example: 'true',
		}),
		OI_EMAIL_HOST: host({
			devDefault: 'smtp.gmail.com',
			desc: 'The host of the email server.',
			docs: 'https://nodemailer.com/smtp/',
			example: 'smtp.gmail.com',
		}),
		OI_EMAIL_PASSWORD: str({
			desc: 'The password of the email server.',
			docs: 'https://nodemailer.com/smtp/',
			example: 'password',
		}),
		OI_EMAIL_PORT: port({
			devDefault: 465,
			desc: 'The port of the email server.',
			docs: 'https://nodemailer.com/smtp/',
			example: '465',
		}),
		OI_EMAIL_SECURE: bool({
			devDefault: true,
			desc: 'The secure of the email server.',
			docs: 'https://nodemailer.com/smtp/',
			example: 'true',
		}),
		OI_EMAIL_USERNAME: str({
			desc: 'The username of the email server.',
			docs: 'https://nodemailer.com/smtp/',
			example: 'username',
		}),
	},
	cleanOptions()
);
export default env;

export const OI_PUBLIC_DIR = resolvePath(env.OI_PUBLIC_DIR);
export const OI_LOGS_DIR = resolvePath(env.OI_LOGS_DIR);

export const {
	NODE_ENV,
	OI_SHUTDOWN_TIMEOUT,
	//OI_DEV_ROLE_ID,
	OI_COOKIES_EXPIRE_IN,
	OI_HOST,
	PORT,
	OI_CORS_ORIGIN,
	OI_EXPIRE_IN_SECONDS,
	OI_COMMON_RATE_LIMIT_MAX_REQUESTS,
	OI_COMMON_RATE_LIMIT_WINDOW_MS,
	OI_MONGODB_DB_URI_WITHOUT_CREDENTIALS,
	// mongodb
	/* OI_MONGODB_DB_HOST,
	OI_MONGODB_DB_PORT, */
	OI_MONGODB_DB_DATABASE,
	OI_MONGODB_DB_USERNAME,
	OI_MONGODB_DB_PASSWORD,
	// mongodb atlas
	/* OI_MONGODB_ATLAS_CLUSTER,
	OI_MONGODB_ATLAS_PRIVATE_KEY,
	OI_MONGODB_ATLAS_PRODJECT_ID,
	OI_MONGODB_ATLAS_PUBLIC_KEY, */
	// Redist
	OI_REDIS_DB_HOST,
	OI_REDIS_DB_PORT,
	OI_REDIS_DB_PASSWORD,
	OI_CLOUDINARY_API_KEY,
	OI_CLOUDINARY_API_SECRET,
	OI_CLOUDINARY_CLOUD_NAME,
	OI_JWT_SECRET,
	OI_MOBILE_AGENT,
	/* OI_MAINTENANCE_PHONE, */
	/* OI_MAINTENANCE_DISCORD_WEBHOOK_URL,
	OI_MAINTENANCE_DISCORD_WEBHOOK_AVATAR,
	OI_MAINTENANCE_DISCORD_WEBHOOK_USERNAME, */

	OI_PUBLIC_CASH_AGE,
	OI_EMAIL_QUEUE_NAME,
	OI_TOKEN_NAME,
	OI_DOMAIN,
	OI_BACK_DOMAIN,
	/* OI_GOOGLE_OAUTH2_CLIENT_ID,
	OI_GOOGLE_OAUTH2_CLIENT_SECRET,
	OI_GOOGLE_OAUTH2_REDIRECT_URI,
	OI_GOOGLE_LINK_REDIRECT_URI, */
	OI_NOREPLY_EMAIL,
	OI_ENABLE_ONLINE,
	OI_EMAIL_HOST,
	OI_EMAIL_PASSWORD,
	OI_EMAIL_PORT,
	OI_EMAIL_SECURE,
	OI_EMAIL_USERNAME,
	OI_PUBLIC_FILES_DOMAIN,
	// envalid other properties
	isDev,
	isProd,
	isTest,
} = env;
// display the environments in the console

displayEnvironments(env);
