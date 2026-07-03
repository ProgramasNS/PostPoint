import db from '../db/Database'
import {Request, Response} from 'express'
import HttpCodes from '../objects/Http';

export const criarComentario = async (req: Request, res: Response) => {
    try {  
        const userId = req.userId;
        const {postId} = req.params;
        const {content} = req.body;
        const postExiste = await db.posts.findUnique({
            where: {id: Number(postId)}
        });
        if (!userId) {
            return res.status(HttpCodes.FORBIDDEN).json({error: "Você não está autenticado(a)!"});
        }
        if (!content || content.length < 10) {
            return res.status(HttpCodes.BAD_REQUEST).json({error: "Comentários precisam de pelo menos 10 caracteres!"});
        }
        if (!postExiste) {
            return res.status(HttpCodes.NOT_FOUND).json({error: "Post não encontrado!"});
        }
        const newComment = await db.comments.create({
            data: {
                user_id: userId!,
                post_id: Number(postId),
                content
            }
        });
        return res.status(HttpCodes.CREATED).json({message: "Comentário criado com sucesso!", comment: newComment});
    } catch (err: any) {
        console.error("Error: ", err);
        return res.status(HttpCodes.INTERNAL_SERVER_ERROR).json({message: "Erro ao criar comentário!"});
    }
}

export const listarComentarios = async (req: Request, res: Response) => {
    try {
        const comentarios = await db.comments.findMany({
            include: {
                users: {
                    select:{
                        id: true,
                        nickname: true,
                        email: true
                    }
                    }
            }
        });
        return res.status(HttpCodes.OK).json(comentarios);
    } catch (err: any) {
        return res.status(HttpCodes.INTERNAL_SERVER_ERROR).json({error: "Erro ao listar comentários!"});
    }
}

export const listarComentariosPorUsuario = async (req: Request, res: Response) => {
    try {
        const {authorId} = req.params;
        const comentAutor = await db.comments.findMany(
            {
                where: {user_id: Number(authorId)}
            }
        );
        return res.status(HttpCodes.OK).json(comentAutor);
    } catch (err: any) {
        return res.status(HttpCodes.INTERNAL_SERVER_ERROR).json({error: "Erro ao listar comentários!"});
    }

}

export const listarComentariosPorPost = async (req: Request, res: Response) => {
    try {
        const {postId} = req.params;
        const comentarios = await db.comments.findMany({
            where: {post_id: Number(postId)}
        });
        return res.status(HttpCodes.OK).json(comentarios);
    } catch (err: any) {
        console.error("Erro: ", err);
        return res.status(HttpCodes.INTERNAL_SERVER_ERROR).json({error: "Erro ao listar comentários"})
    }
}

export const atualizarComentario = async (req: Request, res: Response) => {
    try {
        const {postId, commentId} = req.params;
        const userId = req.userId;
        const {content} = req.body;
        const comment = await db.comments.findUnique({
            where: {id: Number(commentId)},
        });
        if (!comment) {
            return res.status(HttpCodes.NOT_FOUND).json({error: "Comentário não encontrado!"});
        }
        if (userId !== comment?.user_id) {
            return res.status(HttpCodes.UNAUTHORIZED).json({error: "Somente o(a) criador(a) do comentário pode editá-lo!"});
        }
        const atualizaComment = await db.comments.update({
            where: {id: Number(commentId)},
            data: {content}
        });
        return res.status(HttpCodes.OK).json({message: "Comentário atualizado com sucesso!", atualizaComment})
    } catch (err: any) {
        return res.status(HttpCodes.INTERNAL_SERVER_ERROR).json({message: "Erro ao atualizar post!"});
    }
}

export const excluirComentario = async (req: Request, res: Response) => {
    try {
        const userId = req.userId;
        const {postId} = req.params;
        const {commentId} = req.params;
        const comentarioExiste = await db.comments.findUnique({
            where: {id: Number(commentId)}
        });
        if (!comentarioExiste) {
            return res.status(HttpCodes.NOT_FOUND).json({error: "Comentário não encontrado!"});
        }
        if (userId !== comentarioExiste.user_id) {
            return res.status(HttpCodes.NOT_FOUND).json({error: "Somente o(a) criador(a) pode excluir os comentários!"})
        }
        await db.comments.delete({
        where: {id: Number(commentId)}});
        return res.status(HttpCodes.OK).json({message: "Post excluído com sucesso!"});
    } catch (err: any) {
        return res.status(HttpCodes.INTERNAL_SERVER_ERROR).json({error: "Erro ao excluir post!"});
    }
};
