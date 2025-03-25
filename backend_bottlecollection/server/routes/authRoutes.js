import express from 'express'
import { FormSubmission } from '../controller/authController.js';

const authRouter = express.Router();

authRouter.post('/FormSubmission', FormSubmission);
/*authRouter.post('/form', form); */
export default authRouter;