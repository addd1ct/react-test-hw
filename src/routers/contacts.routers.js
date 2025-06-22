import express from 'express';
import { getAllContacts, getContactById, createContactController, updateContactController, deleteContactController } from '../controllers/contacts.controllers.js';
import { validateBody } from '../middlewares/validateBody.js';
import { isValidId } from '../middlewares/isValidId.js';
import { createContactSchema, updateContactSchema } from '../schemas/contacts.schemas.js';
import { authenticate } from '../middlewares/authenticate.js';
import upload from '../middlewares/upload.js';

const contactsRouter = express.Router();

contactsRouter.use(authenticate);
contactsRouter.get('/', getAllContacts);
contactsRouter.get('/:contactId', isValidId, getContactById);
contactsRouter.post('/', authenticate, upload.single('photo'), validateBody(createContactSchema), createContactController);
contactsRouter.patch('/:contactId', authenticate, isValidId, upload.single('photo'), validateBody(updateContactSchema), updateContactController);
contactsRouter.delete('/:contactId', isValidId, deleteContactController);

export default contactsRouter;
