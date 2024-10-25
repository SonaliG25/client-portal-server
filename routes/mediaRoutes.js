// routes/mediaRoutes.js
import express from 'express';
import { getMediaFile } from '../controllers/mediaController.js';
import { isValidUser } from '../middlewares/userValidatorMiddleware.js';

const mediaRouter = express.Router();

mediaRouter.get('/:filename',isValidUser, getMediaFile);

export default mediaRouter;
