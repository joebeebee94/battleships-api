import express from 'express';
import logger from 'morgan';
import router from './routes';
import dotenv from 'dotenv';


dotenv.config();

const app = express();
app.use(express.json());
if (process.env.NODE_ENV === 'development') {
    app.use(logger('dev'));
}

app.use('/game', router);

export default app;