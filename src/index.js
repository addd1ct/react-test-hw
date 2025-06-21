import { initMongoConnection } from './db/initMongoConnection.js';
import { setupServer } from './server.js';
import fs from 'fs/promises';
import { Contact } from './models/contacts.models.js';

await initMongoConnection();

const count = await Contact.countDocuments();
// if (count === 0) {
//   const json = await fs.readFile('./src/db/contacts.json', 'utf-8');
//   const contacts = JSON.parse(json);
//   await Contact.insertMany(contacts);
//   console.log('Контакти завантажені з contacts.json');
// }

setupServer();
