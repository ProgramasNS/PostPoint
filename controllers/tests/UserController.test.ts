import { afterAll, beforeAll, describe, expect, test } from "@jest/globals";
import bcrypt from 'bcrypt';
import request from 'supertest';
import app from "../../app";
import HttpCodes from "../../objects/Http";
import { PrismaClient, users } from '../../generated/prisma';
import jwt from 'jsonwebtoken';
import { uniqueUser } from "../../objects/testModels";

const client = new PrismaClient();

let newUser: any;
let authToken: string;
describe('Testes para users', () => {
    beforeAll(
        async () => {
            //Excluindo dados anteriores 
            await client.comments.deleteMany();
            await client.posts.deleteMany();
            await client.users.deleteMany();
            newUser = await new uniqueUser().init();
            authToken = newUser.token;
            expect(newUser).toBeDefined();
        }
    )
    afterAll(async () => {
        await client.comments.deleteMany();
        await client.posts.deleteMany();
        await client.users.deleteMany();
        await client.$disconnect();
    })
    describe(
        'POST /api/user/new', () => {
            //Função correspondente a "cadastrarUsuario"
            test(
                'Cadastrar novo(a) usuário(a)', async () => {
                    const user = {nickname: 'User inexistente', email: 'email@inexistente.com', password: "Senha super segura"};
                    const res = await request(app).post('/api/user/new').send(user);
                    expect(res.statusCode).toBe(HttpCodes.CREATED);
                }
            );
            //Função edge cases correspondente a "cadastrarUsuario" (caso o nickname já exista)
            test(
                'Verificar nickname existente', async () => {
                    const user = {nickname: newUser.nickname, email: 'email@totalmentenovo.com', password: newUser.noHashPass};
                    const res = await request(app).post('/api/user/new').send(user);
                    expect(res.statusCode).toBe(HttpCodes.CONFLICT);
                    expect(res.body.error).toBe(`${user.nickname} já existe. Use outro.`);
                
                }
            );
            //Função edge cases correspondente a "cadastrarUsuario" (caso o e-mail já exista)
            test(
                'Verificar se um e-mail já existe', async () => {
                    const user = {nickname: "Nickname que não existe", email: newUser.email, password: newUser.noHashPass};
                    const res = await request(app).post('/api/user/new').send(user);
                    expect(res.statusCode).toBe(HttpCodes.CONFLICT);
                    expect(res.body.error).toBe("E-mail já cadastrado no sistema!");
                }
            );
            //Função edge cases correspondente a "cadastrarUsuario" (caso o(a) usuário(a) falte com o nickname)
            test(
                'Verificando o preenchimento do nickname', async () => {
                const content = {email: newUser.email, password: newUser.noHashPass}
                const res = await request(app).post('/api/user/new').send(content);
                expect(res.statusCode).toBe(HttpCodes.BAD_REQUEST);
             }
            )
            //Função edge cases correspondente a "cadastrarUsuario" (caso o(a) usuário(a) falte com o e-mail)
            test(
                'Verificando o preenchimento do e-mail', async () => {
                    const content = {nickname: newUser.nickname, password: newUser.noHashPass};
                    const res = await request(app).post('/api/user/new').send(content);
                    expect(res.statusCode).toBe(HttpCodes.BAD_REQUEST);
                }
            )
            //Função edge cases correspondente a "cadastrarUsuario" (caso o(a) usuário(a) falte com a senha)
            test(
                'Verificando o preenchimento da senha', async () => {
                    const content = {nickname: newUser.nickname, email: newUser.email};
                    const res = await request(app).post('/api/user/new').send(content);
                    expect(res.statusCode).toBe(HttpCodes.BAD_REQUEST);
                }
            )
        }
        
    )
    describe(
        'POST /api/user/login', () => {
            //Função correspondente a "login"
            test(
                'Fazendo login de novo usuário', async () => {
                    const content = {nickname: newUser.nickname, password: newUser.noHashPass}
                    const res = await request(app).post('/api/user/login').send(content);
                    expect(res.statusCode).toBe(HttpCodes.OK);
                }
            )
            //Função edge cases correspondente a "login" (caso o nickname não exista no banco de dados)
            test(
                'Verificando se nickname existe', async () => {
                    const content = {nickname: "Nick obviamente inexistente", password: newUser.noHashPass}
                    const res = await request(app).post('/api/user/login').send(content);
                    expect(res.statusCode).toBe(HttpCodes.NOT_FOUND);
                    expect(res.body.error).toBe("Usuário(a) não existe!");
                }
            )
            //Função edge cases correspondente a "login" (caso a senha esteja errada)
            test(
                'Verificando se a senha está correta', async () => {
                    const content = {nickname: newUser.nickname, password: 'Senha propositalmente errada'}; 
                    const res = await request(app).post('/api/user/login').send(content);
                    expect(res.statusCode).toBe(HttpCodes.UNAUTHORIZED);
                    expect(res.body.error).toBe('Senha incorreta!');
                }
            )
            //Função edge cases correspondente a "login" (caso o nickname não tenha sido enviado)
            test(
                'Verificando se o nickname foi enviado na requisição', async () => {
                    const content = {password: newUser.noHashPass}
                    const res = await request(app).post('/api/user/login').send(content);
                    expect(res.statusCode).toBe(HttpCodes.BAD_REQUEST);
                    expect(res.body.error).toBe("Todos os campos são obrigatórios!");
                }
            )
            //Função edge cases correspondente a "login" (caso a senha não tenha sido enviada)
            test(
                'Verificando se a senha foi enviada na requisição', async () => {
                    const content = {nickname: newUser.nickname};
                    const res = await request(app).post('/api/user/login').send(content);
                    expect(res.statusCode).toBe(HttpCodes.BAD_REQUEST);
                    expect(res.body.error).toBe("Todos os campos são obrigatórios!");
                }
            )
            //Função edge cases correspondente a "login" (caso o login não gere um token)
            test(
                'Verificando se login retorna token', async () => {
                    const content = {nickname: newUser.nickname, password: newUser.noHashPass};
                    const res = await request(app).post('/api/user/login').send(content);
                    expect(res.body.token).toBeDefined();
                }
            )
        }
    )
    describe(
        'PUT /api/user/photo', () => {
            //Função correspondente a "atualizarFoto"
            test(
                'Atualizando a foto de perfil', async () => {
                    const res = await request(app).put('/api/user/photo').set('Authorization', `Bearer ${authToken}`).send({url: 'https://media.istockphoto.com/id/1980276924/vector/no-photo-thumbnail-graphic-element-no-found-or-available-image-in-the-gallery-or-album-flat.jpg'});
                    expect(res.statusCode).toBe(HttpCodes.OK);
                }
            )
            //Função edge cases correspondente a "atualizarFoto" (caso o url esteja vazio)
            test(
                'Verificando se url foi enviado', async () => {
                    const res = await request(app).put('/api/user/photo').set('Authorization', `Bearer ${authToken}`).send({url: ""});
                    expect(res.statusCode).toBe(HttpCodes.BAD_REQUEST);
                    expect(res.body.error).toBe("É obrigatório adicionar o endereço da imagem!");
                }
            )
            //Função edge cases correspondente a "atualizarFoto" (caso o(a) usuário(a) não seja autenticado(a))
            test(
                'Verificando autenticação', async () => {
                    const res = await request(app).put('/api/user/photo').send({url: 'https://media.istockphoto.com/id/1980276924/vector/no-photo-thumbnail-graphic-element-no-found-or-available-image-in-the-gallery-or-album-flat.jpg'});
                    expect(res.statusCode).toBe(HttpCodes.UNAUTHORIZED);
                    expect(res.body.error).toBe("É necessário estar autenticado(a) para atualizar a foto de perfil!");
                }
            )
            //Função edge cases correspondente a "atualizarFoto" (caso a imagem seja inválida)
            test(
                'Verificando se URL é válido', async () => {
                    const url = "urlinvalida.com";
                    const res = await request(app).put('/api/user/photo').set("Authorization", `Bearer ${authToken}`).send({url});
                    expect(res.statusCode).toBe(HttpCodes.BAD_REQUEST);
                    expect(res.body.error).toBe("Insira uma imagem válida!");
                }
            )
        }
    )
  }
)