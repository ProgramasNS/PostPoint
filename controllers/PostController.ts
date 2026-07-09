import db from '../db/Database'
import {Request, Response} from 'express'
import HttpCodes from '../objects/Http'
import { connect } from 'http2';

export const criarPost = async (req: Request, res: Response) => {
    try {
        const userId = req.userId;
        const {title,  content} = req.body;
        let tituloReserva = title?title:'Post Sem Título'; //O título padrão para todos os posts é "Post Sem Título"
        if (!userId) {
            return res.status(HttpCodes.UNAUTHORIZED).json({error: "Você não está autenticado(a)!"});
        }
        if (!content || content.length < 10) {
            return res.status(HttpCodes.BAD_REQUEST).json({error: "São necessários posts de pelo menos 10 caracteres!"});
        }
        const newPost = await db.posts.create({
            data: {title: tituloReserva, content, createdAt: new Date(), user_id: userId}
        });
        return res.status(HttpCodes.CREATED).json({message: "Post criado com sucesso!", post: newPost})
    } catch (err: any) {
        console.error("Erro: ", err);
        return res.status(HttpCodes.INTERNAL_SERVER_ERROR).json({error: "Erro ao criar post!"});
    } 
}

export const listarPosts = async (req: Request, res: Response) => {
    try {
        const posts = await db.posts.findMany({
            include: {
                users: {
                    select: {id: true, nickname: true, email: true}
                }
            }
        });
        return res.status(HttpCodes.OK).json(posts);
    } catch (err: any) {
        console.error("Erro: ", err);
        return res.status(HttpCodes.INTERNAL_SERVER_ERROR).json({error: "Erro ao listar posts!"});
    }
}

export const listarPostsPorUser = async (req: Request, res: Response) => {
    try {
        const {authorId} = req.params;
        const userId = authorId;
        const userExiste = await db.users.findUnique(
            {where: {id: Number(userId)}}
        )
        if(!userExiste || Number(userId) == 0) {
            return res.status(HttpCodes.NOT_FOUND).json({error: "Usuário(a) não encontrado(a)!"});
        }
        const postsdoUser = await db.posts.findMany({
            where: {user_id: userExiste.id}, include: {
            users: {
            select: { id: true, nickname: true}
            }
        },
        orderBy: {
            createdAt: 'desc'
        }
        });
        return res.status(HttpCodes.OK).json(postsdoUser);
    } catch (err: any) {
        console.error("Erro: ", err);
        return res.status(HttpCodes.INTERNAL_SERVER_ERROR).json({error: "Erro ao listar posts!"});
    }
}

export const atualizarPost = async (req: Request, res: Response) => {
    try {
        const userId = req.userId;
        const {title, content} = req.body;
        const {postId} = req.params;
        const post = await db.posts.findUnique({
            where: {id: Number(postId)}
        });
        if (!post) {
            return res.status(HttpCodes.NOT_FOUND).json({error: 'Post não encontrado!'});
        }
        if (userId !== post?.user_id) {
            return res.status(HttpCodes.FORBIDDEN).json({error: "Somente o(a) criador(a) do post pode atualizá-lo!"});
        }
        const postAtualizado = await db.posts.update({
            where: {id: Number(postId)},
            data: {
                title, content, updatedAt: new Date()
            }
        });
        return res.status(HttpCodes.OK).json(postAtualizado)
    } catch (err: any) {
        console.error("Erro: ", err);
        return res.status(HttpCodes.INTERNAL_SERVER_ERROR).json({error: "Erro ao atualizar post!"});
    }

    

}

export const excluirPost = async (req: Request, res: Response) => {
    try {
        const {postId} = req.params;
        const userId = req.userId;
        const postExcluido = await db.posts.findUnique({
            where: {id: Number(postId)}
        });
        if (!postExcluido) {
            return res.status(HttpCodes.NOT_FOUND).json({error: "Post não encontrado!"});
        }
        if (userId !== postExcluido?.user_id) {
            return res.status(HttpCodes.FORBIDDEN).json({error: "Somente o(a) criador(a) do post pode excluí-lo!"});
        }
        await db.posts.delete({
            where: {id: Number(postId)}
        });
        return res.status(HttpCodes.OK).json({message: "Post excluído com sucesso!"})
    } catch (err: any){
        console.error("Error: ", err);
        return res.status(HttpCodes.INTERNAL_SERVER_ERROR).json({error: "Erro ao excluir post!"})
    }
}