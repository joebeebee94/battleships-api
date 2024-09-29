import express from 'express';
import logger from 'morgan';
import router from './routes';

const app = express();
app.use(express.json());
app.use(logger('dev'));
app.use('/game', router);

export default app;