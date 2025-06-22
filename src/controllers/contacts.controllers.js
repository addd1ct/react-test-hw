import { fetchAllContacts, fetchContactById, createContact, updateContact, deleteContact } from '../services/contacts.service.js';
import createHttpError from 'http-errors';

export async function getAllContacts(req, res) {
  const {
    page = 1,
    perPage = 10,
    sortBy = 'name',
    sortOrder = 'asc',
    type,
    isFavourite,
  } = req.query;

  const paginationOptions = {
    page: parseInt(page),
    perPage: parseInt(perPage),
    sortBy,
    sortOrder,
    filter: {},
  };

  if (type) {
    paginationOptions.filter.contactType = type;
  }

  if (isFavourite !== undefined) {
    paginationOptions.filter.isFavourite = isFavourite === 'true';
  }

  const result = await fetchAllContacts(req.user._id, paginationOptions);

  res.status(200).json({
    status: 200,
    message: 'Successfully found contacts!',
    data: result,
  });
}

export async function getContactById(req, res) {
  const { contactId } = req.params;
  const contact = await fetchContactById(contactId, req.user._id);

  if (!contact) {
    throw createHttpError(404, 'Contact not found');
  }

  res.status(200).json({
    status: 200,
    message: `Successfully found contact with id ${contactId}!`,
    data: contact,
  });
}

export async function createContactController(req, res) {
  const newContact = await createContact({ ...req.body, file: req.file }, req.user._id);

  res.status(201).json({
    status: 201,
    message: 'Successfully created contact!',
    data: newContact,
  });
}

export async function updateContactController(req, res) {
  const { contactId } = req.params;
  const updated = await updateContact(contactId, { ...req.body, file: req.file }, req.user._id);

  if (!updated) {
    throw createHttpError(404, 'Contact not found');
  }

  res.status(200).json({
    status: 200,
    message: `Successfully updated contact with id ${contactId}!`,
    data: updated,
  });
}

export async function deleteContactController(req, res) {
  const { contactId } = req.params;
  const deleted = await deleteContact(contactId, req.user._id);

  if (!deleted) {
    throw createHttpError(404, 'Contact not found');
  }

  res.status(204).send();
}
