import { OI_NOREPLY_EMAIL /* , OI_INFO_EMAIL, OI_SUPPORT_EMAIL */ } from '&server/env';

/* service details */
export const emailsAccounts: Record<EmailAccounts, string> = {
	/* 	info: OI_INFO_EMAIL,
	support: OI_SUPPORT_EMAIL, */
	noReply: OI_NOREPLY_EMAIL,
};
