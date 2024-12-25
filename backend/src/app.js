import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';

dotenv.config();

console.log(process.env.DB_PATH);

import { DatabaseManager } from './database/dbManager.js';

import { HomeRouter } from './routes/home.js';
import { MemberRouter } from './routes/member.js';

const app = express();
const port = 3000;

// Database manager
const databaseManager = new DatabaseManager();

// Routes
const homeRouter = new HomeRouter();
const memberRouter = new MemberRouter(databaseManager);

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('src/html'));
app.use(express.static('src/html/user'));

app.use('/', homeRouter.router());
// app.use('/view', viewRouter.router());
app.use('/members', memberRouter.router());

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

