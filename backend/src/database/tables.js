// Member table
// id: integer, primary key
// name: text, utf-8, not null
// grade: text, utf-8, not null
// gender: text, utf-8, not null
// birthyear: integer, not null
// job: text, utf-8, not null
// major: text, utf-8, not null
// speciality1: text, utf-8, not null
// speciality2: text, utf-8, not null
// funnel: text, utf-8, not null
// bookInteresting: text, utf-8, not null
// bookRecently: text, utf-8, not null
// purpose: text, utf-8, not null
// everBookClub: boolean, not null
// memo: text, utf-8, not null
// enrolledAt: datetime, not null
// createdAt: datetime, not null, default current timestamp
// updatedAt: datetime, not null, default current timestamp

// Quarter table
// id: integer, primary key
// year: integer, not null
// quarter: integer, not null
// memo: text, utf-8, not null
// createdAt: datetime, not null, default current timestamp
// updatedAt: datetime, not null, default current timestamp

// QuarterParticipant table
// id: integer, primary key
// memberId: integer, not null
// quarterId: integer, not null
// createdAt: datetime, not null, default current timestamp
// updatedAt: datetime, not null, default current timestamp

// Meeting table
// id: integer, primary key
// quarterId: integer, not null
// number: integer, not null
// date: datetime, not null
// bookName: text, utf-8, not null
// bookAuthor: text, utf-8, not null
// genre: text, utf-8, not null
// leaderId: integer, not null
// paperLink: text, utf-8, can be null
// createdAt: datetime, not null, default current timestamp
// updatedAt: datetime, not null, default current timestamp

// MeetingMemo table
// id: integer, primary key
// meetingId: integer, not null
// memo: text, utf-8, not null
// createdAt: datetime, not null, default current timestamp
// updatedAt: datetime, not null, default current timestamp

// MeetingParticipant table
// id: integer, primary key
// memberId: integer, not null
// meetingId: integer, not null
// createdAt: datetime, not null, default current timestamp
// updatedAt: datetime, not null, default current timestamp

// Table creation queries

const createMemberTable = `
    CREATE TABLE IF NOT EXISTS Member (
        id INTEGER PRIMARY KEY,
        name TEXT NOT NULL,
        grade TEXT NOT NULL,
        gender TEXT NOT NULL,
        birthyear INTEGER NOT NULL,
        job TEXT NOT NULL,
        major TEXT NOT NULL,
        speciality1 TEXT NOT NULL,
        speciality2 TEXT NOT NULL,
        funnel TEXT NOT NULL,
        bookInteresting TEXT NOT NULL,
        bookRecently TEXT NOT NULL,
        purpose TEXT NOT NULL,
        everBookClub BOOLEAN NOT NULL,
        memo TEXT NOT NULL,
        enrolledAt DATETIME NOT NULL,
        createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
`;

const createQuarterTable = `
    CREATE TABLE IF NOT EXISTS Quarter (
        id INTEGER PRIMARY KEY,
        year INTEGER NOT NULL,
        quarter INTEGER NOT NULL,
        memo TEXT NOT NULL,
        createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
`;

const createQuarterParticipantTable = `
    CREATE TABLE IF NOT EXISTS QuarterParticipant (
        id INTEGER PRIMARY KEY,
        memberId INTEGER NOT NULL,
        quarterId INTEGER NOT NULL,
        createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
`;

const createMeetingTable = `
    CREATE TABLE IF NOT EXISTS Meeting (
        id INTEGER PRIMARY KEY,
        quarterId INTEGER NOT NULL,
        number INTEGER NOT NULL,
        date DATETIME NOT NULL,
        bookName TEXT NOT NULL,
        bookAuthor TEXT NOT NULL,
        genre TEXT NOT NULL,
        leaderId INTEGER NOT NULL,
        paperLink TEXT,
        createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
`;

const createMeetingMemoTable = `
    CREATE TABLE IF NOT EXISTS MeetingMemo (
        id INTEGER PRIMARY KEY,
        meetingId INTEGER NOT NULL,
        memo TEXT NOT NULL,
        createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
`;

const createMeetingParticipantTable = `
    CREATE TABLE IF NOT EXISTS MeetingParticipant (
        id INTEGER PRIMARY KEY,
        memberId INTEGER NOT NULL,
        meetingId INTEGER NOT NULL,
        createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
`;

export {
    createMemberTable,
    createQuarterTable,
    createQuarterParticipantTable,
    createMeetingTable,
    createMeetingMemoTable,
    createMeetingParticipantTable
};