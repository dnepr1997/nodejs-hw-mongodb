import { Router } from 'express';
import {
  getContactsByIdController,
  getContactsController,
  addContactsController,
  updateContactsController,
  deleteContactsController,
} from '../controllers/contacts.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { validateBody } from '../middlewares/validateBody.js';
import {
  createContactSchema,
  updateContactSchema,
} from '../validation/contacts.js';
import { isValidId } from '../middlewares/isValidId.js';
import { authenticate } from '../middlewares/authenticate.js';
import { upload } from '../middlewares/multer.js';

// const router = Router();

// router.use(authenticate);

// router.get('/', ctrlWrapper(getContactsController));

// router.get('/:contactId', isValidId, ctrlWrapper(getContactsByIdController));

// router.post(
//   '/',
//   upload.single('photo'),
//   validateBody(createContactSchema),
//   ctrlWrapper(addContactsController),
// );

// router.patch(
//   '/:contactId',
//   upload.single('photo'),
//   isValidId,
//   validateBody(updateContactSchema),
//   ctrlWrapper(updateContactsController),
// );

// router.delete('/:contactId', isValidId, ctrlWrapper(deleteContactsController));
// export default router;
const router = Router();

router.use(authenticate);

router.get('/', ctrlWrapper(getContactsController));

router.get('/:contactId', isValidId, ctrlWrapper(getContactsByIdController));

router.post(
  '/',
  upload.single('photo'),
  validateBody(createContactSchema),
  ctrlWrapper(addContactsController),
);

router.patch(
  '/:contactId',
  upload.single('photo'),
  isValidId,
  validateBody(updateContactSchema),
  ctrlWrapper(updateContactsController),
);

router.delete('/:contactId', isValidId, ctrlWrapper(deleteContactsController));

export default router;
