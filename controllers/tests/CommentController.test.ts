import request from 'supertest'
import HttpCodes from '../../objects/Http'
import app from '../../app';
import { describe, it, test, expect, afterAll, beforeAll} from '@jest/globals';
import { PrismaClient } from '../../generated/prisma';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt'
import { ClientRequest } from 'http';
import {userFalso, tokenFalso} from '../../objects/fakeUser'

const client = new PrismaClient();
const content = {user_id: 1, content: 'Conteúdo para testes'}

const token = async (userId: number = 1) => {
    const payload = { 
        userId: userId,
        nickname: "Usuário de teste"
    };
    const token = jwt.sign(
        payload, 
        process.env.JWT_SECRET || "Meu segredo muito secreto",
        {expiresIn: '7d'}
    );
    return token;
};

//Token feito especificamente para o user falso para gerar uma falsa autenticação

let authToken: string;
let fakeToken: string;
let fakeUser: any;

describe('Testes para comentários', () => {
    beforeAll(
        async () => {
        authToken = await token();
        fakeToken = await tokenFalso();
        fakeUser = await userFalso();
        //Excluindo os dados anteriores para não dar sobreposição
        await client.comments.deleteMany();
        await client.posts.deleteMany();
        await client.users.deleteMany();
        //Criando novos dados
        await client.users.create({
            data: {
                id: 1,
                nickname: "Usuário de teste",
                email: "teste@testmail.com",
                password: await bcrypt.hash('Senha super segura', 10)
            }
        });
        await client.users.create(
            {
                data: fakeUser
            }
        )
        await client.posts.create({
            data: {
                id: 1,
                title: "Título de teste",
                content: "Conteúdo de teste com mais de 10 caracteres",
                user_id: 1,
            }
        });
        await client.comments.create(
            {
                data: {
                    id: 1,
                    content: 'Conteúdo de teste',
                    user_id: 1,
                    post_id: 1
        
                }
            }
        )
     }
    )
    afterAll(async () => {
        await client.comments.deleteMany();
        await client.posts.deleteMany();
        await client.users.deleteMany();
        await client.$disconnect();
    });
    describe(
        'POST /api/post/comment/:postId/new', () => {
            //Função correspondente a "criarComentário" do controller
            test("Deve criar um novo comentário", async () => {
                const postId = 1;
                const content = "Conteúdo de teste";
                const res = await request(app).post(`/api/post/comment/${postId}/new`).set('Authorization', `Bearer ${authToken}`).send({content});
                expect(res.statusCode).toBe(HttpCodes.CREATED);
                expect(res.body.content).toBe(content);
            
            })
            //Função para edge cases correspondente a "criarComentario" caso o comentário possua menos de 10 caracteres ou seja vazio
            test(
                'Verificar se conteúdo tem mais de 10 caracteres', async () => {
                    const postId = 1;
                    const res = await request(app).post(`/api/post/comment/${postId}/new`).set('Authorization', `Bearer ${authToken}`).send({content: ''});
                    expect(res.statusCode).toBe(HttpCodes.BAD_REQUEST);
                    expect(res.body.error).toBe("Comentários precisam de pelo menos 10 caracteres!");
                }
            )
            //Função para edge cases correspondente a "criarComentario" caso o(a) usuário(a) não seja autenticado(a)
            test(
                'Verifica se o(a) usuário(a) é autenticado(a)', async () => {
                    const userId = 0;
                    const postId = 1;
                    const contentLocal = { content: "Conteúdo de teste", user_id: userId};
                    const res = await request(app).post(`/api/post/comment/${postId}/new`).send(contentLocal);
                    expect(Number(res.body.user_id)).toBe(userId);
                    expect(res.statusCode).toBe(HttpCodes.FORBIDDEN);
                    expect(res.body.error).toBe("Você não está autenticado(a)!");
                }
            );
            //Função para edge cases correspondente a "criarComentario" caso o comentário já exista
            test(
                'Verificando se post do comentário já existe', async () => {
                    const postId = 0;
                    const commentId = 1;
                    const contentLocal = {post_id: postId, id: commentId, content: "Conteúdo de teste"};
                    const res = await request(app).post(`/api/post/comment/${postId}/new`).set('Authorization', `Bearer ${authToken}`).send(contentLocal);
                    expect(Number(res.body.post_id)).toBe(postId);
                    expect(res.statusCode).toBe(HttpCodes.NOT_FOUND);
                    expect(res.body.error).toBe("Post não encontrado!");
                }
            );
        }
    )

    //Função correspondente a "listarComentarios"
    describe('GET /', () => {
        test(
            'Deve retornar todos os comentários registrados no banco de dados', async () => {
                const res = await request(app).get('/api/post/comment/');
                const comments = res.body;
                expect(res.statusCode).toBe(HttpCodes.OK);
                expect(Array.isArray(comments)).toBe(true);
            }
        )
    })
    //Função correspondente a "listarComentariosPorUsuario"
    describe('GET /:userId', () => {
        test(
            'Deve retornar todos os comentários de um determinado usuário', async () => {
                const userId = 1;
                const res = await request(app).get(`/api/post/comment/${userId}`);
                const commentsUser = res.body;
                expect(res.statusCode).toBe(HttpCodes.OK);
                commentsUser.forEach((comment: any) => {
                    expect(Number(comment.user_id)).toBe(userId);
                });
            }
        )
        //Função edge cases correspondente a "listarComentariosPorUsuario" (caso o usuário(a) não exista)
        test(
            'Verificar se user existe', async () => {
                const userId = 999999999;
                const res = await request(app).get(`/api/post/comment/${userId}`);
                expect(res.statusCode).toBe(HttpCodes.NOT_FOUND);
                expect(res.body.error).toBe("Usuário(a) não encontrado(a)!");
            }
        )
      }
    )
    //Função correspondente a "listarComentariosPorPost"
    describe('GET /post/:postId', () => {
        test(
            'Deve retornar os comentários de um determinado post', async () => {
                const postId = 1;
                const res = await request(app).get(`/api/post/comment/post/${postId}`);
                const commentsPost = res.body;
                expect(res.statusCode).toBe(HttpCodes.OK);
                commentsPost.forEach((comment: any) => {
                    expect(Number(comment.post_id)).toBe(postId);
                })
            }
        )
        //Função edge cases correspondente a "listarComentariosPorPost" (caso o post não exista)
        test(
            'Verificar se post existe', async () => {
                const postId = 0;
                const res = await request(app).get(`/api/post/comment/post/${postId}`);
                expect(res.statusCode).toBe(HttpCodes.NOT_FOUND);
                expect(res.body.error).toBe("Post não encontrado!");
            }
        )
    }
)

    //Função correspondente a "atualizarComentario"
    describe('PUT /:postId/:commentId', () => {
        test(
            'O comentário deve ser atualizado', async () => {
                const postId = 1;
                const commentId = 1;
                const contentLocal = "Conteúdo de teste";
                const res = await request(app).put(`/api/post/comment/${postId}/${commentId}`).set('Authorization', `Bearer ${authToken}`).send({
                   content: contentLocal
                });
                expect(res.statusCode).toBe(HttpCodes.OK);

            }
        )
        //Função edge cases correspondente a "atualizarComentario" (caso o comentário não exista)
        test(
            'Verificar se comentário existe', async () => {
                const postId = 1;
                const commentId = 0;
                const content = {post_id: postId, id: commentId, content: "Conteúdo de teste"}
                const res = await request(app).put(`/api/post/comment/${postId}/${commentId}`).send(content).set('Authorization', `Bearer ${authToken}`);
                expect(Number(res.body.comment_id)).toBe(commentId);
                expect(res.statusCode).toBe(HttpCodes.NOT_FOUND);
                expect(res.body.error).toBe("Comentário não encontrado!");
            }
        );
        //Função edge cases correspondente a "atualizarComentario" (caso o(a) usuário(a) não seja criador(a) do comentário)
        test(
            'Verificar se o(a) usuário(a) é autor(a) do comentário', async () => {
                const postId = 1;
                const commentId = 1;
                const res = await request(app).put(`/api/post/comment/${postId}/${commentId}`).send({content: 'Novo conteúdo'}).set('Authorization', `Bearer ${fakeToken}`);
                expect(res.statusCode).toBe(HttpCodes.UNAUTHORIZED);
                expect(res.body.error).toBe("Somente o(a) criador(a) do post pode editá-lo!");
          }
        )
      }
    )
    //Função correspondente a "excluirComentario"
    describe('DELETE /:postId/:commentId', () => {
        test(
            'O comentário deve ser excluído', async () => {
                const postId = 1;
                const commentId = 1;
                const res = await request(app).delete(`/api/post/comment/${postId}/${commentId}`).set('Authorization', `Bearer ${authToken}`);
                expect(res.statusCode).toBe(HttpCodes.OK);
            }
        )
        //Função edge cases correspondente a "excluirComentario" (caso o comentário não exista)
        test(
            'Verificando se o comentário existe', async () => {
                const postId = 1;
                const commentId = 0;
                const res = await request(app).delete(`/api/post/comment/${postId}/${commentId}`).set('Authorization', `Bearer ${authToken}`);
                expect(res.statusCode).toBe(HttpCodes.NOT_FOUND);
                expect(res.body.error).toBe("Comentário não encontrado!");
            }
        )
        //Função edge cases correspondente a "excluirComentario" (caso o(a) usuário(a) não seja autor(a) do comentário)
        test(
            'Verificando se o(a) usuário(a) é autor(a) do comentário',  async () => {
                const postId = 1;
                const commentId = 1;
                const res = await request(app).delete(`/api/post/comment/${postId}/${commentId}`).set('Authorization', `Bearer ${fakeToken}`);
                expect(res.statusCode).toBe(HttpCodes.UNAUTHORIZED);
                expect(res.body.error).toBe("Somente o(a) criador(a) pode excluir os comentários!");
            }
         );
        }
    )
  }
)
