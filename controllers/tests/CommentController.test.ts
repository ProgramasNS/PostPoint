import request from 'supertest'
import HttpCodes from '../../objects/Http'
import app from '../../app';
import { describe, it, test, expect} from '@jest/globals';

//Função correspondente a "criarComentário" do controller
describe(
    'POST /:postId/new', () => {
        test("Deve criar um novo comentário", async () => {
            const postId = 1;
            const content = "Conteúdo de teste";
            const res = await request(app).post(`/${postId}/new`).send({content});
            expect(res.statusCode).toBe(HttpCodes.CREATED);
            expect(res.body.content).toBe(content);
        })
    }
);

//Função correspondente a "listarComentarios"
describe(
    'GET /', () => {
        test(
            'Deve retornar todos os comentários registrados no banco de dados', async () => {
                const res = await request(app).get('/');
                const comments = res.body;
                expect(res.statusCode).toBe(HttpCodes.OK);
                expect(Array.isArray(comments)).toBe(true);
            }
        )
    }
);

//Função correspondente a "listarComentariosPorUsuario"
describe(
    'GET /:userId', () => {
        test(
            'Deve retornar todos os comentários de um determinado usuário', async () => {
                const userId = 1;
                const res = await request(app).get(`/${userId}`);
                const commentsUser = res.body;
                expect(res.statusCode).toBe(HttpCodes.OK);
                commentsUser.forEach((comment: any) => {
                    expect(comment.user_id).toBe(userId);
                });
            }
        )
    }
);

//Função correspondente a "listarComentariosPorPost"
describe(
    'GET /post/:postId', () => {
        test(
            'Deve retornar os comentários de um determinado post', async () => {
                const postId = 1;
                const res = await request(app).get(`/post/${postId}`);
                const commentsPost = res.body;
                expect(res.statusCode).toBe(HttpCodes.OK);
                commentsPost.forEach((comment: any) => {
                    expect(comment.post_id).toBe(postId);
                })
            }
        )
    }
);

//Função correspondente a "atualizarComentario"
describe(
    'PUT /:postId/:commentId', () => {
        test(
            'O comentário deve ser atualizado', async () => {
                const postId = 1;
                const commentId = 1;
                const content = "Conteúdo de teste";
                const res = await request(app).put(`/${postId}/${commentId}`).send({
                    content
                });
                expect(res.statusCode).toBe(HttpCodes.OK);

            }
        )
    }
)

//Função correspondente a "excluirComentario"

describe(
    'DELETE /:postId/:commentId', () => {
        test(
            'O comentário deve ser excluído', async () => {
                const postId = 1;
                const commentId = 1;
                const res = await request(app).delete(`/${postId}/${commentId}`);
                expect(res.statusCode).toBe(HttpCodes.OK);
            }
        )
    }
)