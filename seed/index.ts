import mongoose from 'mongoose';
// import { seedWebsite } from './website';
import { seedUsers } from './admin';
import seedServices, { mongoDBServiceSeed, rl } from './services';
async function seed() {
	console.time('server');
	await Promise.all(seedServices);
	console.timeEnd('server');

	mongoose.set('debug', true);
	console.time('seeding');
	console.timeLog('seeding', 'started');

	const user = await seedUsers();
	console.log('🚀 ~ seed ~ user:', user);

	console.timeLog('seeding', 'ended');
	console.timeEnd('seeding');
	rl.close();
	mongoDBServiceSeed.stop();
	process.exit(0);
}

seed();
