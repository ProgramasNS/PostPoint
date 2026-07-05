import { afterAll, beforeAll, describe, expect, test } from "@jest/globals";
import bcrypt from 'bcrypt';
import request from 'supertest';
import app from "../../app";
import HttpCodes from "../../objects/Http";
import { PrismaClient } from '../../generated/prisma';
import jwt from 'jsonwebtoken';

const client = new PrismaClient();
const token = async () => {
    const token = await jwt.sign(
        {url: "https://media.istockphoto.com/id/1980276924/vector/no-photo-thumbnail-graphic-element-no-found-or-available-image-in-the-gallery-or-album-flat.jpg"}, 
        process.env.JWT_SECRET || "Meu segredo muito secreto",
        {expiresIn: '7d'}
    )
    return token;
}
let hashSenhaUniversal = "Senha super segura"
describe('Testes para users', () => {
    beforeAll(
        async() => {
            await token();
            hashSenhaUniversal = await bcrypt.hash(hashSenhaUniversal, 10);
        }
    )
    afterAll(async () => {
        await client.users.deleteMany();
        await client.$disconnect();
    })
    describe(
        'POST /api/user/new', () => {
            //Função correspondente a "cadastrarUsuario"
            test(
                'Cadastrar novo(a) usuário(a)', async () => {
                    const user = {nickname: 'Teste', email: 'testando@testuser.com', password: hashSenhaUniversal};
                    const res = await request(app).post('/api/user/new').send(user);
                    expect(res.statusCode).toBe(HttpCodes.CREATED);
                }
            );
            //Função edge cases correspondente a "cadastrarUsuario" (caso o nickname já exista)
            test(
                'Verificar nickname existente', async () => {
                    const user = {nickname: "Usuário de teste", email: "teste@testmail.com", password: hashSenhaUniversal};
                    const res = await request(app).post('/api/user/new').send(user);
                    expect(res.statusCode).toBe(HttpCodes.CONFLICT);
                    expect(res.body.error).toBe(`${user.nickname} já existe. Use outro.`);
                
                }
            );
            //Função edge cases correspondente a "cadastrarUsuario" (caso o e-mail já exista)
            test(
                'Verificar se um e-mail já existe', async () => {
                    const user = {nickname: "Usuário de teste", email: "email@email.com", password: hashSenhaUniversal};
                    const res = await request(app).post('/api/user/new').send(user);
                    expect(res.statusCode).toBe(HttpCodes.CONFLICT);
                    expect(res.body.error).toBe("E-mail já cadastrado no sistema!");
                }
            );
            //Função edge cases correspondente a "cadastrarUsuario" (caso o(a) usuário(a) falte com o nickname)
            test(
                'Verificando o preenchimento do nickname', async () => {
                const content = {email: "email@email.com", password: hashSenhaUniversal}
                const res = await request(app).post('/api/user/new').send(content);
                expect(res.statusCode).toBe(HttpCodes.BAD_REQUEST);
             }
            )
            //Função edge cases correspondente a "cadastrarUsuario" (caso o(a) usuário(a) falte com o e-mail)
            test(
                'Verificando o preenchimento do e-mail', async () => {
                    const content = {nickname: 'Usuário de teste', password: hashSenhaUniversal};
                    const res = await request(app).post('/api/user/new').send(content);
                    expect(res.statusCode).toBe(HttpCodes.BAD_REQUEST);
                }
            )
            //Função edge cases correspondente a "cadastrarUsuario" (caso o(a) usuário(a) falte com a senha)
            test(
                'Verificando o preenchimento da senha', async () => {
                    const content = {nickname: 'Nome de teste', email: "email@email.com"};
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
                    const content = {nickname: 'Usuário de teste', password: "Senha super segura"}
                    const res = await request(app).post('/api/user/login').send(content);
                    expect(res.statusCode).toBe(HttpCodes.OK);
                }
            )
            //Função edge cases correspondente a "login" (caso o nickname não exista no banco de dados)
            test(
                'Verificando se nickname existe', async () => {
                    const content = {nickname: "Nick para testes", password: "Senha super segura"}
                    const res = await request(app).post('/api/user/login').send(content);
                    expect(res.body.user_id).toBe(null);
                    expect(res.statusCode).toBe(HttpCodes.NOT_FOUND);
                    expect(res.body.error).toBe("Usuário(a) não existe!");
                }
            )
            //Função edge cases correspondente a "login" (caso a senha esteja errada)
            test(
                'Verificando se a senha está correta', async () => {
                    const content = {nickname: 'User de teste', password: hashSenhaUniversal}; //Todas as senhas são criptografadas; essa senha passaria por dupla criptografia, impossibilitando a comparação com o usuário já existente. Portanto, está sempre incorreta
                    const res = await request(app).post('/api/user/login').send(content);
                    expect(res.statusCode).toBe(HttpCodes.UNAUTHORIZED);
                    expect(res.body.error).toBe('Senha incorreta!');
                }
            )
            //Função edge cases correspondente a "login" (caso o nickname não tenha sido enviado)
            test(
                'Verificando se o nickname foi enviado na requisição', async () => {
                    const content = {password: "Senha super segura"}
                    const res = await request(app).post('/api/user/login').send(content);
                    expect(res.statusCode).toBe(HttpCodes.BAD_REQUEST);
                }
            )
            //Função edge cases correspondente a "login" (caso a senha não senha enviada)
            test(
                'Verificando se a senha foi enviada na requisição', async () => {
                    const content = {nickname: 'Usuário de teste'};
                    const res = await request(app).post('/api/user/login').send(content);
                    expect(res.statusCode).toBe(HttpCodes.BAD_REQUEST);
                    expect(res.body.password).toBe(null);
                }
            )
            //Função edge cases correspondente a "login" (caso o login não gere um token)
            test(
                'Verificando se login retorna token', async () => {
                    const content = {nickname: 'Usuário de teste', password: 'Senha super segura'};
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
                    const res = await request(app).put('/api/user/photo').set('Authorization', `Bearer ${await token()}`).send('https://media.istockphoto.com/id/1980276924/vector/no-photo-thumbnail-graphic-element-no-found-or-available-image-in-the-gallery-or-album-flat.jpg');
                    expect(res.statusCode).toBe(HttpCodes.OK);
                }
            )
            //Função edge cases correspondente a "atualizarFoto" (caso o url esteja vazio)
            test(
                'Verificando se url foi enviado', async () => {
                    const res = await request(app).put('/api/user/photo').set('Authorization', `Bearer ${await token()}`).send(undefined);
                    expect(res.statusCode).toBe(HttpCodes.BAD_REQUEST);
                    expect(res.body.error).toBe("É necessário estar autenticado(a) para atualizar a foto de perfil!");
                }
            )
            //Função edge cases correspondente a "atualizarFoto" (caso o(a) usuário(a) não seja autenticado(a))
            test(
                'Verificando autenticação', async () => {
                    const res = await request(app).put('/api/user/photo').send('https://media.istockphoto.com/id/1980276924/vector/no-photo-thumbnail-graphic-element-no-found-or-available-image-in-the-gallery-or-album-flat.jpg');
                    expect(res.statusCode).toBe(HttpCodes.FORBIDDEN);
                    expect(res.body.error).toBe("É necessário estar autenticado(a) para atualizar a foto de perfil!");
                }
            )
            //Função edge cases correspondente a "atualizarFoto" (caso a imagem seja inválida)
            test(
                'Verificando se URL é válido', async () => {
                    const url = "urlinvalida.com";
                    const res = await request(app).put('/api/user/photo').send({url});
                    expect(res.statusCode).toBe(HttpCodes.BAD_REQUEST);
                    expect(res.body.error).toBe("Insira uma imagem válida!");
                }
            )
        }
    )
  }
)