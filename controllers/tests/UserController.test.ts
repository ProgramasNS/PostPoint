import { afterAll, describe, expect, test } from "@jest/globals";
import bcrypt from 'bcrypt'
import request from 'supertest'
import app from "../../app";
import HttpCodes from "../../objects/Http";
import {PrismaClient} from '@prisma/client'

const client = new PrismaClient();
describe('Testes para users', () => {
    afterAll(async () => {
        await client.users.deleteMany();
        await client.$disconnect();
    })
    describe(
        'POST /new', () => {
            //Função correspondente a "cadastrarUsuario"
            test(
                'Cadastrar novo(a) usuário(a)', async () => {
                    const password = await bcrypt.hash("Senha de teste", 10);
                    const user = {nickname: 'Teste', email: 'testando@testuser.com', password};
                    const res = await request(app).post('/new').send(user);
                    expect(res.statusCode).toBe(HttpCodes.CREATED);
                }
            );
            //Função edge cases correspondente a "cadastrarUsuario" (caso o nickname já exista)
            test(
                'Verificar nickname existente', async () => {
                    const user = {nickname: "Usuário de teste", email: "teste@testmail.com", password: await bcrypt.hash("Senha de teste", 10)};
                    const res = await request(app).post('/new').send(user);
                    expect(res.statusCode).toBe(HttpCodes.CONFLICT);
                    expect(res.body.error).toBe(`${user.nickname} já existe. Use outro.`);
                
                }
            );
            //Função edge cases correspondente a "cadastrarUsuario" (caso o e-mail já exista)
            test(
                'Verificar se um e-mail já existe', async () => {
                    const user = {nickname: "Usuário de teste", email: "email@email.com", password: await bcrypt.hash("Senha de teste", 10)};
                    const res = await request(app).post('/new').send(user);
                    expect(res.statusCode).toBe(HttpCodes.CONFLICT);
                    expect(res.body.error).toBe("E-mail já cadastrado no sistema!");
                }
            );
            //Função edge cases correspondente a "cadastrarUsuario" (caso o(a) usuário(a) falte com qualquer uma das informações obrigatórias)
            test(
                'Verificando o preenchimento de todas as informações', async () => {
                
             }
            )
        }
    )
  }
)