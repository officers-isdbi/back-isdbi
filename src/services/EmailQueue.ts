import { URL } from 'node:url';
import { Queue } from 'bullmq';
import type IORedis from 'ioredis';

import { cLogger } from '$server/console';

import { OI_DOMAIN, OI_EMAIL_QUEUE_NAME } from '&server/env';

import type { OTPSessionHydratedDocument } from '!server/generated/OTPSession';
import Service from './Service';

/* service details */
const defaultId = 'EmailService';

class EmailQueueService extends Service<Queue<QueuedEmail>> {
	name = 'Email queue service';
	category = 'Email';
	description = 'Email queuing service';

	redisClient: IORedis;

	constructor(redisClient: IORedis, id = defaultId) {
		super(id, EmailQueueService.connect(Promise.resolve(redisClient)));
		this.redisClient = redisClient;
		this.connection.then(() => {
			cLogger.info('📬 Email queuing service ready to go');
		});
	}

	public static async connect(connection: Promise<IORedis>): Promise<Queue<QueuedEmail>> {
		return connection.then(conn => {
			const queue = new Queue<QueuedEmail>(OI_EMAIL_QUEUE_NAME, {
				connection: conn,
			});
			return queue.waitUntilReady().then(() => queue);
		});
	}

	public sendEmail(email: QueuedEmail) {
		return this.connection
			.then(queue => queue.add('sendEmail', email))
			.then(job => cLogger.info(`📨 Email sent: ${job.id}`));
	}

	public static RecoveryEmail(
		user: UserI,
		language: LanguagesI,
		session: OTPSessionHydratedDocument,
		otp: string
	): QueuedEmail {
		return {
			to: user.email,
			subject: 'FY - password recovery',
			context: {
				name: `${user.firstName} ${user.lastName}`,
				resetUrl: new URL(`/auth/session/reset-password?sessionId=${session._id}&otpCode=${otp}`, OI_DOMAIN)
					.href,
				language,
				otp,
			},
			template: 'resetPassword',
			from: 'noReply',
		};
	}

	public static ValidationEmail(
		user: UserI,
		language: LanguagesI,
		session: OTPSessionHydratedDocument,
		otp: string
	): QueuedEmail {
		return {
			to: user.email,
			subject: 'FY - email validation',
			context: {
				name: `${user.firstName} ${user.lastName}`,
				validateUrl: new URL(`/validate/email?sessionId=${session._id}&otpCode=${otp}`, OI_DOMAIN).href,
				language,
				otp: otp,
			},
			template: 'validateEmail',
			from: 'noReply',
		};
	}
	public static ResetedPasswordEmail(
		user: UserI,
		language: LanguagesI,
		password: string
	): QueuedEmail<'resetedPassword'> {
		return {
			to: user.email,
			subject: 'FY manager - reseted password',
			context: {
				name: `${user.firstName} ${user.lastName}`,
				language,
				password,
			},
			template: 'resetedPassword',
			from: 'noReply',
		};
	}
	public static WelcomeAdminEmail(user: UserI, language: LanguagesI, password: string): QueuedEmail<'welcomeAdmin'> {
		return {
			to: user.email,
			subject: 'FY manager - new admin account',
			context: {
				name: `${user.firstName} ${user.lastName}`,
				language,
				password,
				email: user.email,
				adminLoginURL: new URL('/login', OI_DOMAIN).href,
			},
			template: 'welcomeAdmin',
			from: 'noReply',
		};
	}

	public async stop() {
		return this.connection.then(conn => conn.close().then(() => this.redisClient.disconnect()));
	}
}
export default EmailQueueService;
