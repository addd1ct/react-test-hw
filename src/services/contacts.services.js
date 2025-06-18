import { Contact } from '../models/contact.models.js';

export async function fetchAllContacts({ page, perPage, sortBy, sortOrder, filter }) {
  const skip = (page - 1) * perPage;
  const sort = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };

  const [contacts, totalItems] = await Promise.all([
    Contact.find(filter).sort(sort).skip(skip).limit(perPage),
    Contact.countDocuments(filter),
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

export async function fetchContactById(id) {
  return Contact.findById(id);
}

export async function createContact(data) {
  return Contact.create(data);
}

export async function updateContact(id, data) {
  return Contact.findByIdAndUpdate(id, data, { new: true });
}

export async function deleteContact(id) {
  return Contact.findByIdAndDelete(id);
}
