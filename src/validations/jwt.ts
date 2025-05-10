import { type MyZodType, z } from '@common/validations/defaultZod';
import { mongoIDSchema } from '@common/validations/elements';
import type { RawCreateParams } from 'zod';
interface MessagesT {
	issAt: LanguagesContentI<RawCreateParams>;
	pk: LanguagesContentI<RawCreateParams>;
	salt: LanguagesContentI<RawCreateParams>;
	issBy: LanguagesContentI<RawCreateParams>;
}
const { issAt, pk, salt, issBy }: MessagesT = {
	issAt: {
		en: {
			required_error: 'The issue date of the token is required',
			invalid_type_error: 'Invalid issue date of the token',
			message: 'The issue date of the token',
		},
		fr: {
			required_error: "La date d'émission du jeton est requise",
			invalid_type_error: "Date d'émission de jeton invalide",
			message: "La date d'émission du jeton",
		},
	},
	pk: {
		en: {
			required_error: 'The public key is required',
			invalid_type_error: 'Invalid public key',
			message: 'The public key',
		},
		fr: {
			required_error: 'La clé publique est requise',
			invalid_type_error: 'Clé publique invalide',
			message: 'La clé publique',
		},
	},
	salt: {
		en: {
			required_error: 'The salt is required',
			invalid_type_error: 'Invalid salt',
			message: 'The salt',
		},
		fr: {
			required_error: 'Le sel est requis',
			invalid_type_error: 'Sel invalide',
			message: 'Le sel',
		},
	},
	issBy: {
		en: {
			required_error: 'The issuer is required',
			invalid_type_error: 'Invalid issuer',
			message: 'The issuer',
		},
		fr: {
			required_error: "L'émetteur est requis",
			invalid_type_error: 'Émetteur invalide',
			message: "L'émetteur",
		},
	},
};
export const OI_JWT_PayloadSchema = (locale: LanguagesI) =>
	z.object<MyZodType<JWT_Payload>>({
		id: mongoIDSchema('en'),
		issAt: z.number(issAt[locale]),
		pk: z.string(pk[locale]),
		salt: z.string(salt[locale]),
		issBy: z.string(issBy[locale]),
	});
