import nodemailer, { type Transporter } from 'nodemailer';
import type Mail from 'nodemailer/lib/mailer';
import type SMTPTransport from 'nodemailer/lib/smtp-transport';

import { cLogger } from '$server/console';

// import { fLogger } from '$server/file';
import { OI_EMAIL_HOST, OI_EMAIL_PASSWORD, OI_EMAIL_PORT, OI_EMAIL_SECURE, OI_EMAIL_USERNAME } from '&server/env';
import Service from './Service';

/* service details */
const id = 'EmailService';

class EmailService extends Service<Transporter<SMTPTransport.SentMessageInfo>> {
	name = 'Email';
	category = 'Email';
	description = 'Email Service';
	enabled: boolean;
	constructor(enabled = true) {
		super(
			id,
			enabled
				? EmailService.connect()
				: (Promise.resolve() as unknown as Promise<Transporter<SMTPTransport.SentMessageInfo>>)
		);
		this.enabled = enabled;
	}
	public static async connect() {
		return new Promise<Transporter<SMTPTransport.SentMessageInfo>>((resolve, reject) => {
			const transporter = nodemailer.createTransport({
				host: OI_EMAIL_HOST,
				port: OI_EMAIL_PORT,
				secure: OI_EMAIL_SECURE,
				auth: {
					user: OI_EMAIL_USERNAME,
					pass: OI_EMAIL_PASSWORD,
				},
				tls: {
					rejectUnauthorized: false,
					minVersion: 'TLSv1.2', // Specify the minimum TLS version
				},
			});
			transporter
				.verify()
				.then(() => {
					cLogger.info('📬 The email service is ready');
					resolve(transporter);
				})
				.catch(error => {
					cLogger.error(`📭 Error in Email Service ${error}`);
					// fLogger.error(`📭 Error in Email Service ${error}`);
					reject(error);
				});
		});
	}
	async sendEmail(mail: Mail.Options) {
		if (this.enabled)
			return this.connection.then(transporter => {
				return transporter.sendMail(mail);
			});
	}
	public stop(): Promise<void> {
		return this.connection.then(transporter => {
			return transporter.close();
		});
	}
}
export default EmailService;
