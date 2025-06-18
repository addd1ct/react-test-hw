import express from 'express';
import { getAllContacts, getContactById, createContactController, updateContactController, deleteContactController } from '../controllers/contacts.controllers.js';
import { validateBody } from '../middlewares/validateBody.js';
import { isValidId } from '../middlewares/isValidId.js';
import { createContactSchema, updateContactSchema } from '../schemas/contacts.schemas.js';

const contactsRouter = express.Router();

contactsRouter.get('/', getAllContacts);
contactsRouter.get('/:contactId', isValidId, getContactById);
contactsRouter.post('/', validateBody(createContactSchema), createContactController);
contactsRouter.patch('/:contactId', isValidId, validateBody(updateContactSchema), updateContactController);
contactsRouter.delete('/:contactId', isValidId, deleteContactController);

export default contactsRouter;
