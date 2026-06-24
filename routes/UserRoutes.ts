import Router from 'express'
import {cadastrarUsuario, login} from '../controllers/UserController'

const userRouter = Router();
userRouter.post('/new', cadastrarUsuario);
userRouter.post('/login', login);

export default userRouter;