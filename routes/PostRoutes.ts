import verificarToken from '../middlewares/auth'
import Router from 'express'
import {criarPost, listarPosts, atualizarPost, excluirPost} from '../controllers/PostController'

const postRoute = Router();

postRoute.post('/new', verificarToken, criarPost);
postRoute.get('/', listarPosts);

export default postRoute;