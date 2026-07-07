//Este módulo é específico para a geração de models para testes automatizados
import bcrypt from 'bcrypt'
import {users, posts, comments, PrismaClient} from '../generated/prisma'
import {db} from '../db/TestsDatabase'
import jwt from 'jsonwebtoken'

//A classe correspondente à model "users". Ela cria users com propriedades únicas, como forma de evitar replicações de users nos testes.
export class uniqueUser  {
    public id!: number;
    public nickname!: string;
    public email!: string;
    public password!: string;
    public noHashPass!: string;
    public profilePic!: string | null;
    private client: PrismaClient = db;

    public async init(): Promise<any> {

        this.noHashPass = 'Senha super segura';
        const user = await this.client.users.create(
            {
                data: await this.generate()
            }
        );
        return {...user, noHashPass: this.noHashPass, token: this.generateToken(user.id)}
        
    }

    private async generate(): Promise<any> {
        const random = Math.floor(1 + Math.random() * 99999999999);
        this.nickname = `Usuário_${random}_${Date.now()}`;
        this.email = `email${random}${Date.now()}@mail.com`;
        this.profilePic = '';
        
        this.password = await bcrypt.hash('Senha super segura', 10);
        return {nickname: this.nickname, email: this.email, password: this.password, profilePic: this.profilePic};
    }

    private generateToken(userId: number){
        const payload = { 
            userId: userId,
            nickname: "Usuário de teste"
        };
        const token = jwt.sign(
            payload, 
            process.env.JWT_SECRET || "Meu segredo muito secreto",
            {expiresIn: '7d'}
        );
        return token;
    }
}

