import {NextFunction, Request, Response} from 'express'
import jwt, { decode } from 'jsonwebtoken'
import HttpCodes from '../objects/Http';
const verificarToken = async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        return res.status(HttpCodes.UNAUTHORIZED).json({error: "Token não fornecido!"});
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!);
        (req as any).user = decoded;
        next();
    } catch (err: any) {
        console.error("Erro: ", err);
        return res.status(HttpCodes.UNAUTHORIZED).json({error: "Token não autorizado!"});
    }
}

export default verificarToken;