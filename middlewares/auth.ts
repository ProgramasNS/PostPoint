import {NextFunction, Request, Response} from 'express'
import jwt, { decode, JwtPayload } from 'jsonwebtoken'
import HttpCodes from '../objects/Http';
import dotenv from 'dotenv'

dotenv.config();

const verificarToken = async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        return res.status(HttpCodes.UNAUTHORIZED).json({error: "Token não fornecido!"});
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload & {id: number};
        req.userId = decoded.id;
        next();
    } catch (err: any) {
        console.error("Erro: ", err);
        return res.status(HttpCodes.UNAUTHORIZED).json({error: "Token não autorizado!"});
    }
}

export default verificarToken;