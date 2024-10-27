// routes.js
import { Router } from 'express';
import { downloadInvoice } from '../controllers/invoiceController.js';
const router = Router();

router.get('/:invoiceId/download', downloadInvoice);

export default router;
