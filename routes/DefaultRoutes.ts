import { Router, Request, Response} from "express";
import HttpCodes from "../objects/Http";

const defaultRoute = Router();
defaultRoute.get('/', (req: Request, res: Response) => {
    return res.status(HttpCodes.OK).json({message: "Bem-vindo(a) ao PostPoint!"});
})

export default defaultRoute;