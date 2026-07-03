import { describe, expect, test} from "@jest/globals";
import request from 'supertest';
import app from "../../app";
import HttpCodes from "../../objects/Http";

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
    }
);

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
    }
);

//Função correspondente a listarPostsPorUsuario
describe(
    'GET /author/:authorId', () => {
        test(
            'Listar os posts de um usuário específico', async () => {
                
            }
        )
    }
)