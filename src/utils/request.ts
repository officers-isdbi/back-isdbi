import type { Request } from 'express';
const languages: LanguagesI[] = ['en', 'fr' /* , 'ar' */] as const;
export function getRequestLanguage(req: Request): LanguagesI {
	const l = req.headers['accept-language'];
	return l && languages.includes(l as LanguagesI) ? (l as LanguagesI) : 'en';
}
