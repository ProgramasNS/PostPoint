import request from 'supertest'
import HttpCodes from '../../objects/Http'
import app from '../../app';
import { describe, it } from 'node:test';
import { criarComentario } from '../CommentController';

describe(
    'POST /:postId/new', () => {
        it("Criar novo comentário", async () => {
            const postId = 14;
            const comentario = await request(app).post(`/${postId}/new`).send({content: 'Conteúdo de teste'});

        })
    }
)