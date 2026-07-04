import { afterAll, describe, expect, test} from "@jest/globals";
import request from 'supertest';
import app from "../../app";
import HttpCodes from "../../objects/Http";
import { PrismaClient } from "@prisma/client";

const client = new PrismaClient();

describe('Testes para posts', () => {
    afterAll(async () => {
        await client.posts.deleteMany();
        await client.$disconnect();
    })
    //Função correspondente a "criarPost"
    describe(
        'POST /new', () => {
            test(
                'Criando novo post', async () => {
                    const userId = 1;
                    const content = {
                        title: "Título para teste", content: "Conteúdo para teste", date: new Date(), user_id: userId
                    };
                    const res = await request(app).post('/new').send(content);
                    expect(res.body.content).toBe(content);
                    expect(res.statusCode).toBe(HttpCodes.CREATED);
                }
            )
            //Função para edge cases correspondente a "criarPost" (caso o(a) usuário(a) não esteja autenticado(a))
            test(
                'Deve retornar "FORBIDDEN" caso o(a) usuário(a) não seja autenticado(a)', async () => {
                    const userId = null;
                    const content = {title: "Titulo de teste", content: "Conteúdo de teste", user_id: userId}
                    const res = await request(app).post('/new').send(content);
                    expect(res.statusCode).toBe(HttpCodes.FORBIDDEN);
                    expect(res.body.user_id).toBe(userId);
                    expect(res.body.error).toBe("Você não está autenticado(a)!");
                }
            )
            //Função para edge cases correspondente a "criarPost" (caso o post tenha menos de 10 caracteres)
            test(
                'Verificar se post possui menos de 10 caracteres', async () => {
                    const content = {title: "Titulo para testes", content: null};
                    const res = await request(app).post('/new').send(content); 
                    expect(!res.body.content || res.body.content.length < 10).toBe(true);
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
                const res = await request(app).get('/');
                const posts = res.body;
                expect(res.statusCode).toBe(HttpCodes.OK);
                expect(Array.isArray(posts)).toBe(true);
            }
        )
        //Função correspondente a listarPostsPorUsuario
        test(
            'Listar os posts de um usuário específico', async () => {
                const authorId = 1;
                const res = await request(app).get(`/author/${authorId}`);
                expect(res.statusCode).toBe(HttpCodes.OK);
                const postsUser = res.body;
                postsUser.forEach((post: any) => {
                    expect(post.user_id).toBe(authorId);
                });
            }
        );
    }
);

//Função correspondente a "atualizarPost"
describe(
    'PUT /:postId', () => {
        test (
            'Atualizar determinado post', async () => {
                const postId = 1;
                const title = "Titulo de teste";
                const content = "Conteúdo de teste";
                const res = await request(app).put(`/${postId}`).send({title, content});
                expect(res.statusCode).toBe(HttpCodes.OK);
                expect(res.body.title).toBe(title);
                expect(res.body.content).toBe(content);
            }
        )
        //Função para edge cases correspondente a "atualizarPost" (caso o post não exista)
        test(
            'Deve retornar "Not Found" caso o post não exista', async () => {
                const postId = null;
                const res = await request(app).put(`/${postId}`).send({title: "Titulo de teste", content: "Conteúdo de teste"});
                expect(res.statusCode).toBe(HttpCodes.NOT_FOUND);
                expect(res.body.error).toBe('Post não encontrado!');
            }
        )
        //Função para edge cases correspondente a "atualizarPost" (caso o(a) usuário(a) não tenha criado o post)
        test(
            'Deve retornar "UNAUTHORIZED" caso o(a) usuário(a) não seja o(a) criador(a) do post', async () => {
                const userId = null;
                const postId = 1;
                const title = "Titulo de teste";
                const content = "Conteudo de teste";
                const res = await request(app).put(`/${postId}`).send({title, content});
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
                const res = await request(app).delete(`/${postId}`);
                expect(res.statusCode).toBe(HttpCodes.OK);
            }
        )
        //Função para edge cases correspondente a "excluirPost" (caso o post não exista)
        test(
            'Verificar se post existe antes de excluir', async () => {
                const postId = null;
                const res = await request(app).delete(`/${postId}`);
                expect(res.statusCode).toBe(HttpCodes.NOT_FOUND);
                expect(res.body.error).toBe("Post não encontrado!");
            }
        )
        //Função para edge cases correspondente a "excluirPost" (caso o(a) usuário(a) não seja autor(a) do post)
        test(
            'Verifica se o(a) usuário(a) é autor(a) do post', async () => {
                const userId = null;
                const postId = 1;
                const res = await request(app).delete(`/${postId}`);
                expect(res.statusCode).toBe(HttpCodes.UNAUTHORIZED);
                expect(res.body.error).toBe('Somente o(a) criador(a) do post pode excluí-lo!');
            }
        );
    }
);