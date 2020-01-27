import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';
import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import ProviderController from './app/controllers/ProviderController';
import FileController from './app/controllers/FileController';
import AppointmentController from './app/controllers/AppointmentController';
import authHeader from './app/middlewares/auth';

const routes = Router();
const upload = multer(multerConfig);

routes.post('/users', UserController.store);
routes.post('/sessions', SessionController.store);
routes.use(authHeader);
routes.put('/users', UserController.update);
routes.post('/files', upload.single('file'), FileController.store)
routes.get('/providers', ProviderController.index)
routes.post('/appointments', AppointmentController.store)
routes.get('/appointments', AppointmentController.index)

module.exports = routes;
