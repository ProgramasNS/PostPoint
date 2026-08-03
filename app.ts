import express from 'express'
import cors from 'cors'
import userRouter from './routes/UserRoutes'
import postRoute from './routes/PostRoutes'
import commentRoute from './routes/CommentRoutes';
import bodyParser from 'body-parser'
import defaultRoute from './routes/DefaultRoutes'

const app = express();
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/api/user', userRouter);
app.use('/api/post', postRoute);
app.use('/api/post/comment', commentRoute);

export default app;