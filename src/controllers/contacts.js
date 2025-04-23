import {
  getContacts,
  getContactsById,
  addContacts,
  updateContacts,
  deleteContactsById,
} from '../services/contacts.js';
import createHttpError from 'http-errors';

export const getContactsController = async (req, res) => {
  const data = await getContacts();
  res.json({
    status: 200,
    message: 'Successfully found contacts!',
    data,
  });
};

export const getContactsByIdController = async (req, res) => {
  const { contactId } = req.params;
  const data = await getContactsById(contactId);
  if (!data) {
    throw createHttpError(404, `Contact with ${contactId}not found`);
  }
  res.json({
    status: 200,
    message: `Successfully found contact with id ${contactId}!`,
    data,
  });
};

export const addContactsController = async (req, res) => {
  const data = await addContacts(req.body);
  res.status(201).json({
    status: 201,
    message: 'Successfully created a contact!',
    data,
  });
};

export const updateContactsController = async (req, res) => {
  const { contactId } = req.params;
  const data = await updateContacts(contactId, req.body);
  if (!data) {
    throw createHttpError(404, 'Contact not found');
  }

  res.json({
    status: 200,
    message: 'Successfully patched a contact!',
    data,
  });
};

export const deleteContactsController = async (req, res) => {
  const { contactId } = req.params;
  const data = await deleteContactsById(contactId);
  if (!data) {
    throw createHttpError(404, 'Contact not found');
  }
  res.status(204).send();
};
