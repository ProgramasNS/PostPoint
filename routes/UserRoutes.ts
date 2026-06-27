import Router from 'express'
import {atualizarFoto, cadastrarUsuario, login} from '../controllers/UserController'
import verificarToken from '../middlewares/auth';

const userRouter = Router();
userRouter.post('/new', cadastrarUsuario);
userRouter.post('/login', login);
userRouter.put('/photo', verificarToken, atualizarFoto);

export default userRouter;