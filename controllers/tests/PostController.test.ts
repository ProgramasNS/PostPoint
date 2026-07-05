import { afterAll, beforeAll, describe, expect, test} from "@jest/globals";
import request from 'supertest';
import app from "../../app";
import HttpCodes from "../../objects/Http";
import { PrismaClient } from '../../generated/prisma';
import verificarToken from "../../middlewares/auth";
import {Request, Response} from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const content = {title: "Título de teste", content: "Conteúdo de teste", date: new Date(), user_id: 1};

const token = async () => {
    const token = await jwt.sign(
        content, 
        process.env.JWT_SECRET || "Meu segredo muito secreto",
        {expiresIn: '7d'}
    )
    return token;
}
const client = new PrismaClient();

describe('Testes para posts', () => {
    beforeAll(async () => await token())
    afterAll(async () => {
        await client.posts.deleteMany();
        await client.$disconnect();
    })
    //Função correspondente a "criarPost"
    describe(
        'POST /api/post/new', () => {
            test(
                'Criando novo post', async () => {
                    const userId = 1;
                    const res = await request(app).post('/api/post/new').set('Authorization', `Bearer ${await token()}`).send(content);
                    expect(res.body.content).toBe(content.content);
                    expect(res.body.title).toBe(content.title);
                    expect(res.body.user_id).toBe(content.user_id);
                    expect(res.statusCode).toBe(HttpCodes.CREATED);
                }
            )
            //Função para edge cases correspondente a "criarPost" (caso o(a) usuário(a) não esteja autenticado(a))
            test(
                'Deve retornar "FORBIDDEN" caso o(a) usuário(a) não seja autenticado(a)', async () => {
                    const userId = 0;
                    let contentCopia = content;
                    contentCopia.user_id = userId;
                    const res = await request(app).post('/api/post/new').send(contentCopia);
                    expect(res.statusCode).toBe(HttpCodes.FORBIDDEN);
                    expect(res.body.user_id).toBe(userId);
                    expect(res.body.error).toBe("Você não está autenticado(a)!");
                }
            )
            //Função para edge cases correspondente a "criarPost" (caso o post tenha menos de 10 caracteres)
            test(
                'Verificar se post possui menos de 10 caracteres', async () => {
                    const res = await request(app).post('/api/post/new').set('Authorization', `Bearer ${await token()}`).send({content: ''}); 
                    expect(res.statusCode).toBe(HttpCodes.BAD_REQUEST);
                    expect(res.body.error).toBe("São necessários posts de pelo menos 10 caracteres!");
                }
            )
        }
    )
  }
)
//Função correspondente a "listarPosts"
describe(
    'GET /', () => {
        test(
            'Listar todos os posts', async () => {
                const res = await request(app).get('/api/post/');
                const posts = res.body;
                expect(res.statusCode).toBe(HttpCodes.OK);
                expect(Array.isArray(posts)).toBe(true);
            }
        )
    }
);

describe('GET /api/post/author/:authorId', () => {
     //Função correspondente a listarPostsPorUsuario
        test(
            'Listar os posts de um usuário específico', async () => {
                const authorId = 1;
                const res = await request(app).get(`/api/post/author/${authorId}`);
                expect(res.statusCode).toBe(HttpCodes.OK);
                const postsUser = res.body;
                postsUser.forEach((post: any) => {
                    expect(Number(post.user_id)).toBe(authorId);
                });
            }
        );
        
        //Função edge cases correspondente a listarPostsPorUsuario (caso o(a) usuário(a) não exista)
        test(
            'Verificando se usuário(a) existe', async () => {
                const authorId = 99999;
                const res = await request(app).get(`/api/post/author/${authorId}`);
                expect(res.statusCode).toBe(HttpCodes.NOT_FOUND);
                expect(res.body.error).toBe("Usuário(a) não encontrado(a)!");
            }
        )
    }
)

//Função correspondente a "atualizarPost"
describe(
    'PUT /:postId', () => {
        test (
            'Atualizar determinado post', async () => {
                const postId = 1;
                const title = "Titulo de teste";
                const contentLocal = "Conteúdo de teste";
                const res = await request(app).put(`/api/post/${postId}`).send({title, content: contentLocal}).set('Authorization', `Bearer ${await token()}`);
                expect(res.statusCode).toBe(HttpCodes.OK);
                expect(res.body.title).toBe(title);
                expect(res.body.content).toBe(contentLocal);
            }
        )
        //Função para edge cases correspondente a "atualizarPost" (caso o post não exista)
        test(
            'Deve retornar "Not Found" caso o post não exista', async () => {
                const postId = 0;
                const res = await request(app).put(`/api/post/${postId}`).set('Authorization', `Bearer ${await token()}`).send({title: "Titulo de teste", content: "Conteúdo de teste"});
                expect(res.statusCode).toBe(HttpCodes.NOT_FOUND);
                expect(res.body.error).toBe('Post não encontrado!');
            }
        )
        //Função para edge cases correspondente a "atualizarPost" (caso o(a) usuário(a) não tenha criado o post)
        test(
            'Deve retornar "UNAUTHORIZED" caso o(a) usuário(a) não seja o(a) criador(a) do post', async () => {
                const userId = 9999;
                const postId = 1;
                const title = "Titulo de teste";
                const content = "Conteudo de teste";
                const res = await request(app).put(`/api/post/${postId}`).send({user_id: userId, post_id: postId, title, content});
                expect(res.statusCode).toBe(HttpCodes.UNAUTHORIZED);
                expect(res.body.error).toBe("Somente o(a) criador(a) do post pode atualizá-lo!");
            }
        );
    }
);

//Função correspondente a "excluirPost"
describe(
    'DELETE /:postId', () => {
        test(
            'Apagando um post', async () => {
                const postId = 1;
                const res = await request(app).delete(`/api/post/${postId}`).set('Authorization', `Bearer ${await token()}`);
                expect(res.statusCode).toBe(HttpCodes.OK);
            }
        )
        //Função para edge cases correspondente a "excluirPost" (caso o post não exista)
        test(
            'Verificar se post existe antes de excluir', async () => {
                const postId = 0;
                const res = await request(app).delete(`/api/post/${postId}`).set('Authorization', `Bearer ${await token()}`);
                expect(res.statusCode).toBe(HttpCodes.NOT_FOUND);
                expect(res.body.error).toBe("Post não encontrado!");
            }
        )
        //Função para edge cases correspondente a "excluirPost" (caso o(a) usuário(a) não seja autor(a) do post)
        test(
            'Verifica se o(a) usuário(a) é autor(a) do post', async () => {
                const userId = 0;
                const postId = 1;
                const res = await request(app).delete(`/api/post/${postId}`);
                expect(res.statusCode).toBe(HttpCodes.UNAUTHORIZED);
                expect(res.body.error).toBe('Somente o(a) criador(a) do post pode excluí-lo!');
            }
        );
    }
);