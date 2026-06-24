import Router from 'express'
import {cadastrarUsuario, login} from '../controllers/UserController'

const UserRouter = Router();
UserRouter.post('/new', cadastrarUsuario);
UserRouter.post('/login', login);

export default UserRouter;