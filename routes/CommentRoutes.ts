import Router from 'express'
import {criarComentario, listarComentarios, listarComentariosPorUsuario, atualizarComentario, excluirComentario, listarComentariosPorPost} from '../controllers/CommentController'
import verificarToken from '../middlewares/auth';
const commentRoute = Router();

commentRoute.post('/:postId/new', verificarToken, criarComentario);
commentRoute.get('/', listarComentarios);
commentRoute.get('/:userId', listarComentariosPorUsuario);
commentRoute.get('/post/:postId', listarComentariosPorPost);
commentRoute.put('/:postId/:commentId', verificarToken, atualizarComentario);
commentRoute.delete('/:postId/:commentId', verificarToken, excluirComentario);

export default commentRoute;
