import express from 'express'
import cors from 'cors'
import userRouter from './routes/UserRoutes'
import postRoute from './routes/PostRoutes'

const app = express();
app.use(express.json());
app.use(cors());
app.use('/api/user', userRouter);
app.use('/api/post', postRoute);

export default app;