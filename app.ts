import express from 'express'
import cors from 'cors'
import userRouter from './routes/UserRoutes'

const app = express();
app.use(express.json());
app.use(cors());
app.use('/api/user', userRouter);

export default app;