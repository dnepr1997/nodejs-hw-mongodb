import { Router } from 'express';
import {
  getContactsByIdController,
  getContactsController,
  addContactsController,
  updateContactsController,
  deleteContactsController,
} from '../controllers/contacts.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';

export const router = Router();

router.get('/', ctrlWrapper(getContactsController));

router.get('/:contactId', ctrlWrapper(getContactsByIdController));

router.post('/', ctrlWrapper(addContactsController));

router.patch('/:contactId', ctrlWrapper(updateContactsController));

router.delete('/:contactId', ctrlWrapper(deleteContactsController));
