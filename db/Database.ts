import * as pkg from '../generated/prisma';
const {PrismaClient} = pkg;
 
const db = new PrismaClient();

export default db;