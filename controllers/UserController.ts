import db from '../db/Database'
import {Request, Response} from 'express'
import HttpCodes from '../objects/Http'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config();

export const cadastrarUsuario = async (req: Request, res: Response) => {
    try{
        const {nickname, email, password} = req.body;
        if (!nickname || !email || !password) {
            return res.status(HttpCodes.BAD_REQUEST).json({error: "Todos os campos são obrigatórios!"});
        }
        const nickExists = await db.users.findUnique({
            where:{nickname}
        });
        const emailExists = await db.users.findUnique({
            where: {email}
        });
        if (nickExists) {
            return res.status(HttpCodes.CONFLICT).json({error: `${nickname} já existe. Use outro.`});
        }
        if (emailExists) {
            return res.status(HttpCodes.CONFLICT).json({error: "E-mail já cadastrado no sistema!"});
        }
        const hashPassword = await bcrypt.hash(password, 10);
        const newUser = await db.users.create({
            data: {nickname, email, password: hashPassword}
        });
        const {password:_, ...userSemSenha} = newUser;
        return res.status(HttpCodes.CREATED).json({message: "Usuário(a) criado(a) com sucesso!", user: userSemSenha});
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
        const nickExists = await db.users.findUnique({
            where: {nickname}
        });
        if (!nickExists) {
            return res.status(HttpCodes.NOT_FOUND).json({error: "Usuário(a) não existe!"});
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

export const atualizarFoto = async (req: Request, res: Response) => {
    try {
        const userId = req.userId;
        const {url} = req.body;
        const validFormats = ['jpeg', 'jpg', 'png', 'tiff', 'gif'];
        if (!url) {
            return res.status(HttpCodes.BAD_REQUEST).json({error: "É obrigatório adicionar o endereço da imagem!"});
        }
        let isValid = false;
        for (const format of validFormats) {
            if (url.toLowerCase().endsWith(format)) {
                isValid = true;
            }
        }
        if (!isValid) {
            return res.status(HttpCodes.BAD_REQUEST).json({error: "Insira uma imagem válida!"});
        }
        if (!userId) {
            return res.status(HttpCodes.UNAUTHORIZED).json({error: "É necessário estar autenticado(a) para atualizar a foto de perfil!"});
        }
        const reqImagem = await db.users.update({where: {id: userId}, data: {
                profilePic: url
            }});
        return res.status(HttpCodes.OK).json({url: reqImagem});
    } catch (err: any){
        console.error("Erro: ", err);
        return res.status(HttpCodes.INTERNAL_SERVER_ERROR).json({error: "Erro ao modificar foto!"})
    }
}
