import db from '../db/Database'
import {Request, Response} from 'express'
import HttpCodes from '../objects/Http'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

export const cadastrarUsuario = async (req: Request, res: Response) => {
    try{
        const {nickname, email, password} = req.body;
        if (!nickname || !email || !password) {
            return res.status(HttpCodes.BAD_REQUEST).json({error: "Todos os campos são obrigatórios!"});
        }
        const nickExists = await db.user.findUnique({
            where:{nickname}
        });
        const emailExists = await db.user.findUnique({
            where: {email}
        });
        if (nickExists != null) {
            return res.status(HttpCodes.CONFLICT).json({error: `${nickname} já existe. Use outro.`});
        }
        if (emailExists != null) {
            return res.status(HttpCodes.CONFLICT).json({error: "E-mail já cadastrado no sistema!"});
        }
        const hashPassword = await bcrypt.hash(password, 10);
        const newUser = await db.user.create({
            data: {nickname, email, password: hashPassword}
        });
        return res.status(HttpCodes.CREATED).json({message: "Usuário(a) criado(a) com sucesso!"});
    } catch (e: any) {
        console.error("Ocorreu um erro: ", e);
        return res.status(HttpCodes.INTERNAL_SERVER_ERROR).json({error: "Erro ao cadastrar usuário!"});
    }
}

export const login = async (req: Request, res: Response) => {
    try {
        const {nickname, password} = req.body;
        if (!nickname || !password) {
            return res.status(HttpCodes.BAD_REQUEST).json({error: "Todos os campos são obrigatórios!"});
        }
        const nickExists = await db.user.findUnique({
            where: {nickname}
        });
        if (!nickExists) {
            return res.status(HttpCodes.UNAUTHORIZED).json({error: "Usuário(a) não existe!"});
        }
        const senhaCerta = await bcrypt.compare(password, nickExists.password);
        if (!senhaCerta) {
            return res.status(HttpCodes.UNAUTHORIZED).json({error: 'Senha incorreta!'});
        }
        const token = jwt.sign({id: nickExists.id}, process.env.JWT_SECRET!, {expiresIn: '7d'});

        return res.status(HttpCodes.OK).json({message: "Login feito com sucesso!", token});
    } catch (e: any) {
        console.error("Ocorreu um erro: ", e);
        return res.status(HttpCodes.INTERNAL_SERVER_ERROR).json({error: "Erro ao fazer login!"});
    }
}

