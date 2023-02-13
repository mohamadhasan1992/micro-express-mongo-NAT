import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';
import {createTicketRouter} from "./routes/new";
import { showTicketsRouter } from './routes/show';
import { indexTicketRouter } from './routes';
import { errorHandler, NotFoundError, CurrentUser } from '@microtickets_mh/common';
import { updateTicketRouter } from './routes/update';




const app = express();
app.set('trust proxy', true);
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== 'test'
  })
);

app.use(CurrentUser);

app.use(createTicketRouter);
app.use(showTicketsRouter);
app.use(indexTicketRouter);
app.use(updateTicketRouter);



app.all('*', async (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
