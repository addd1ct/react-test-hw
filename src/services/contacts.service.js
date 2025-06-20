import { Contact } from '../models/contacts.models.js';
import createHttpError from 'http-errors';

export async function fetchAllContacts(userId, { page, perPage, sortBy, sortOrder, filter }) {
  const skip = (page - 1) * perPage;
  const sort = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };

  const query = { ...filter, userId };

  const [contacts, totalItems] = await Promise.all([
    Contact.find(query).sort(sort).skip(skip).limit(perPage),
    Contact.countDocuments(query),
  ]);

  const totalPages = Math.ceil(totalItems / perPage);

  return {
    data: contacts,
    page,
    perPage,
    totalItems,
    totalPages,
    hasPreviousPage: page > 1,
    hasNextPage: page < totalPages,
  };
}

export async function fetchContactById(contactId, userId) {
  const contact = await Contact.findOne({ _id: contactId, userId });
  if (!contact) throw createHttpError(404, 'Contact not found');
  return contact;
}

export async function createContact(data, userId) {
  return Contact.create({ ...data, userId });
}

export async function updateContact(contactId, data, userId) {
  const updated = await Contact.findOneAndUpdate({ _id: contactId, userId }, data, { new: true });
  if (!updated) throw createHttpError(404, 'Contact not found');
  return updated;
}

export async function deleteContact(contactId, userId) {
  const deleted = await Contact.findOneAndDelete({ _id: contactId, userId });
  if (!deleted) throw createHttpError(404, 'Contact not found');
  return deleted;
}
