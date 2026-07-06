import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

//User falso feito propositalmente para não passar nos testes automatizados de autoria de posts e comentários
export const userFalso = async () => {
    return { 
        id: 9999,
        nickname: "Não é o autor",
        email: "email@emailfalso.com",
        password: await bcrypt.hash("Senha super segura", 10)        
    }
}

export const tokenFalso = async () => {
    const payload = await userFalso();
    const token = jwt.sign(
        payload, 
        process.env.JWT_SECRET || "Meu segredo muito secreto",
        {expiresIn: '7d'}
    );
    return token;
};