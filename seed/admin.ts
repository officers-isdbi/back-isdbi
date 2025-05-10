import userModel from '#server/user';
import { question } from './prompt';

const user = async (): Promise<RegistrationUserI> => {
	const firstName = await question('Enter first name: ');
	const lastName = await question('Enter last name: ');
	const email = await question('Enter email: ');
	const phone = await question('Enter phone number: ');
	const password = await question('Enter password: ');
	return {
		email,
		password: password,
		phone,
		firstName: firstName,
		lastName: lastName,
		confirmPassword: password,
	};
};

export async function seedUsers() {
	const admin = await user();
	await userModel.create(admin);
	return admin;
}

export async function getRandomUsersIds(size: number) {
	return (await userModel.aggregate().sample(size).project({ _id: 1 }).exec()).map(el => el._id);
}
