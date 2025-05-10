import jwt, { type SignOptions, type VerifyOptions } from 'jsonwebtoken';
import type { ZodError, ZodObject, ZodType } from 'zod';

export class JWT<PayLoad extends object = { id: string }> {
	private secret: string;
	private schema: (locale: LanguagesI) => ZodObject<Record<keyof PayLoad, ZodType<PayLoad[keyof PayLoad]>>>;
	constructor(
		secret: string,
		schema: (locale: LanguagesI) => ZodObject<Record<keyof PayLoad, ZodType<PayLoad[keyof PayLoad]>>>
	) {
		this.secret = secret;
		this.schema = schema;
	}
	public sign(payload: PayLoad, options?: SignOptions): string {
		return jwt.sign(payload, this.secret, options);
	}
	public verify(locale: LanguagesI, token: string, options?: VerifyOptions & { complete?: false }): PayLoad {
		const load = jwt.verify(token, this.secret, { ...(options || null), complete: false });

		try {
			this.schema(locale).parse(load);
			return load as PayLoad;
		} catch (err) {
			const errorMessage = `Invalid input: ${(err as ZodError).errors.map(e => e.message).join(', ')}`;
			throw new Error(errorMessage);
		}
	}
}
