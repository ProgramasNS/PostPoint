import bcrypt from 'bcrypt'

export const uniqueUser = async () => {
    return {nickname: `Usuário ${Date.now()}`,
    email: `teste${Math.floor(Math.random() * 9999999999999999)}@testmail.com`,
    password: await bcrypt.hash('Senha super segura', 10)
    }
}
