import verificarToken from '../middlewares/auth'
import Router from 'express'
import {criarPost, listarPosts, atualizarPost, excluirPost, listarPostsPorUser} from '../controllers/PostController'

const postRoute = Router();

postRoute.post('/new', verificarToken, criarPost);
postRoute.get('/', listarPosts);
postRoute.get('/author/:userId', listarPostsPorUser);
postRoute.put('/:postId', verificarToken, atualizarPost);
postRoute.delete('/:postId', verificarToken, excluirPost);

export default postRoute;