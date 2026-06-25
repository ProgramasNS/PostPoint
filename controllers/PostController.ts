import db from '../db/Database'
import {Request, Response} from 'express'
import HttpCodes from '../objects/Http'

export const criarPost = (req: Request, res: Response) => {
    try {
        const {userId} = req.params;
        const {title,  content} = req.body;
        let tituloReserva = title?title:'Post Sem Título'; //O título padrão para todos os posts é "Post Sem Título"
        if (!content || content.length < 10) {
            return res.status(HttpCodes.BAD_REQUEST).json({error: "São necessários posts de pelo menos 10 caracteres!"});
        }
        const newPost = db.posts.create({
            data: {user_id: Number(userId), title: tituloReserva, content}
        });
        return res.status(HttpCodes.CREATED).json({message: "Post criado com sucesso!", post: newPost})
    } catch (err: any) {
        return res.status(HttpCodes.INTERNAL_SERVER_ERROR).json({error: "Erro ao criar post!"});
    } 
}

export const listarPosts = (req: Request, res: Response) => {

}

export const atualizarPost = (req: Request, res: Response) => {

}

export const excluirPost = (req: Request, res: Response) => {

}