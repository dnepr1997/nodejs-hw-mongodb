import {
  getContacts,
  getContactsById,
  addContacts,
  updateContacts,
  deleteContactsById,
} from '../services/contacts.js';
import createHttpError from 'http-errors';
import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { parseSortParams } from '../utils/parseSortParams.js';
import { parseFilterParams } from '../utils/parseFilterParams.js';
import { getEnvVar } from '../utils/getEnvVar.js';
import { saveFileToCloudinary } from '../utils/saveFileToCloudinary.js';
import { saveFileToUploadDir } from '../utils/saveFileToUploadDir.js';

export const getContactsController = async (req, res) => {
  // const paginationParams = parsePaginationParams(req.query);
  // const sortParams = parseSortParams(req.query, contactsSortFields);
  // const filter = parseFilterParams(req.query);
  // filter.userId = req.user._id;
  // const data = await getContacts({
  //   ...paginationParams,
  //   ...sortParams,
  //   filter,
  // });
  // res.json({
  //   status: 200,
  //   message: 'Successfully found contacts!',
  //   data,
  // });
  const { page, perPage } = parsePaginationParams(req.query);
  const { sortOrder, sortBy } = parseSortParams(req.query);
  const { isFavorite } = parseFilterParams(req.query);

  const contacts = await getContacts({
    page,
    perPage,
    sortOrder,
    sortBy,
    isFavorite,
    userId: req.user._id,
  });
  res.status(200).json({
    status: 200,
    message: 'Successfully found contacts!',
    data: contacts,
  });
};

export const getContactsByIdController = async (req, res) => {
  const { contactId } = req.params;
  const contact = await getContactsById(contactId, req.user._id);
  if (!contact) {
    throw createHttpError(404, 'Contact not found');
  }
  res.status(200).json({
    status: 200,
    message: `Successfully found contact with id ${contactId}!`,
    data: contact,
  });
};

export const addContactsController = async (req, res) => {
  const photo = req.file;

  let photoUrl;

  if (photo) {
    if (getEnvVar('ENABLE_CLOUDINARY') === 'true') {
      photoUrl = await saveFileToCloudinary(photo);
    } else {
      photoUrl = await saveFileToUploadDir(photo);
    }
  }

  const updateData = {
    ...req.body,
    photo: photoUrl,
  };
  const contact = await addContacts(updateData, req.user._id);

  res.status(201).json({
    status: 201,
    message: 'Successfully created a contact!',
    data: contact,
  });
};

// export const updateContactsController = async (req, res) => {
//   const { contactId } = req.params;
//   const data = await updateContacts(contactId, req.body);
//   if (!data) {
//     throw createHttpError(404, 'Contact not found');
//   }
//   if (data.userId.toString() !== req.user._id.toString()) {
//     throw createHttpError(403, 'Access denied to update this contact');
//   }

//   res.json({
//     status: 200,
//     message: 'Successfully patched a contact!',
//     data,
//   });
// };

export const updateContactsController = async (req, res, next) => {
  const { contactId } = req.params;
  const photo = req.file;

  let photoUrl;

  if (photo) {
    if (getEnvVar('ENABLE_CLOUDINARY') === 'true') {
      photoUrl = await saveFileToCloudinary(photo);
    } else {
      photoUrl = await saveFileToUploadDir(photo);
    }
  }

  const updateData = {
    ...req.body,
    photo: photoUrl,
  };

  const result = await updateContacts(contactId, updateData, req.user._id);

  if (!result) {
    throw createHttpError(404, 'Contact not found');
  }

  res.json({
    status: 200,
    message: 'Successfully patched a contact!',
    data: result,
  });
};
// export const deleteContactsController = async (req, res, next) => {
//   const { contactId } = req.params;
//   const data = await deleteContactsById(contactId);
//   if (!data) {
//     throw createHttpError(404, 'Contact not found');
//   }
//   if (data.userId.toString() !== req.user._id.toString()) {
//     throw createHttpError(403, 'Access denied to delete this contact');
//   }
//   res.status(204).send();
// };

export const deleteContactsController = async (req, res) => {
  const { contactId } = req.params;
  const contact = await deleteContactsById(contactId, req.user._id);
  if (!contact) {
    throw createHttpError(404, 'Contact not found');
  }
  res.status(204).send();
};
