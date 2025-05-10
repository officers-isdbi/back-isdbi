//import RolesManagerService from '@server/services/Roles';
import { stdin as input, stdout as output } from 'node:process';
import readline from 'node:readline';
import MongoDBService from '@server/services/MongoDB';

export const rl = readline.createInterface({ input, output });
export const mongoDBServiceSeed = new MongoDBService();
//export const rolesManagerService = new RolesManagerService();

const seedServices = [mongoDBServiceSeed.Connection /* rolesManagerService.Connection */];
export default seedServices;
