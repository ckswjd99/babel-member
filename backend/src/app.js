import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';

dotenv.config();

console.log(process.env.DB_PATH);

import { DatabaseManager } from './database/dbManager.js';

import { HomeRouter } from './routes/home.js';
import { MemberRouter } from './routes/member.js';
import { QuarterRouter } from './routes/quarter.js';
import { MeetingRouter } from './routes/meeting.js';

const app = express();
const port = 3000;

// Database manager
const databaseManager = new DatabaseManager();

// Routes
const homeRouter = new HomeRouter();
const memberRouter = new MemberRouter(databaseManager);
const quarterRouter = new QuarterRouter(databaseManager);
const meetingRouter = new MeetingRouter(databaseManager);

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('src/html'));
app.use(express.static('src/html/user'));

app.use('/', homeRouter.router());
app.use('/members', memberRouter.router());
app.use('/quarters', quarterRouter.router());
app.use('/meetings', meetingRouter.router());

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

