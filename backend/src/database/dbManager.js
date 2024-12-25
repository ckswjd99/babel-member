import sqlite3 from 'sqlite3';
import {
    createMemberTable,
    createQuarterTable,
    createQuarterMemoTable,
    createQuarterParticipantTable,
    createMeetingTable,
    createMeetingMemoTable,
    createMeetingParticipantTable
} from './tables.js';

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
// createdAt: datetime, not null, default current timestamp
// updatedAt: datetime, not null, default current timestamp

// QuarterMemo table
// id: integer, primary key
// quarterId: integer, not null
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
// paperLink: text, utf-8, not null
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

class DatabaseManager {
    constructor() {
        this.db = new sqlite3.Database(process.env.DB_PATH, (err) => {
            if (err) {
                console.error('Database opening error: ', err);
            } else {
                console.log('Connected to SQLite database');
                this.createTables();
            }
        });
    }

    close() {
        this.db.close((err) => {
            if (err) {
                console.error('Database closing error: ', err);
            } else {
                console.log('Database connection closed');
            }
        });
    }

    // Create tables
    createTables() {
        this.db.run(createMemberTable);
        this.db.run(createQuarterTable);
        this.db.run(createQuarterMemoTable);
        this.db.run(createQuarterParticipantTable);
        this.db.run(createMeetingTable);
        this.db.run(createMeetingMemoTable);
        this.db.run(createMeetingParticipantTable);
    }

    // CRUD operations for members
    // Create: get every column value except id
    createMember(member) {
        const {
            name, grade, gender, birthyear, job, major, speciality1, speciality2, funnel,
            bookInteresting, bookRecently, purpose, everBookClub, memo, enrolledAt
        } = member;

        const sql = `INSERT INTO Member (name, grade, gender, birthyear, job, major, speciality1, speciality2, funnel, bookInteresting, bookRecently, purpose, everBookClub, memo, enrolledAt)
                     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

        this.db.run(sql, [name, grade, gender, birthyear, job, major, speciality1, speciality2, funnel, bookInteresting, bookRecently, purpose, everBookClub, memo, enrolledAt], function(err) {
            if (err) {
                console.error('Error inserting member: ', err);
            } else {
                console.log(`A row has been inserted with rowid ${this.lastID}`);
            }
        });
    }

    // Read: get single member by id, return member object
    async getMemberById(id) {
        const sql = `SELECT * FROM Member WHERE id = ?`;
        
        return new Promise((resolve, reject) => {
            this.db.get(sql, [id], (err, row) => {
                if (err) {
                    console.error('Error getting member: ', err);
                    reject(err);
                } else {
                    console.log(row);
                    resolve(row);
                }
            });
        });
        
    }

    // Read: get all members with matching column values given by object, return array of member objects
    async getMembersByColumnValues(columnValues) {
        const columns = Object.keys(columnValues);
        const values = Object.values(columnValues);

        if (columns.length === 0) {
            return this.getAllMembers();
        }

        const sql = `SELECT * FROM Member WHERE ${columns.map(column => `${column} = ?`).join(' AND ')}`;

        return new Promise((resolve, reject) => {
            this.db.all(sql, values, (err, rows) => {
                if (err) {
                    console.error('Error getting members: ', err);
                    reject(err);
                } else {
                    console.log(rows);
                    resolve(rows);
                }
            });
        });
    }

    // Read: get all members, return array of member objects
    async getAllMembers() {
        const sql = `SELECT * FROM Member`;

        return new Promise((resolve, reject) => {
            this.db.all(sql, [], (err, rows) => {
                if (err) {
                    console.error('Error getting members: ', err);
                    reject(err);
                } else {
                    console.log(rows);
                    resolve(rows);
                }
            });
        });
    }

    // Update: update member by id, set every column value except id
    async updateMemberById(id, columnValues) {
        const columns = Object.keys(columnValues);
        const values = Object.values(columnValues);

        const sql = `UPDATE Member SET ${columns.map(column => `${column} = ?`).join(', ')} WHERE id = ?`;

        return new Promise((resolve, reject) => {
            this.db.run(sql, [...values, id], function(err) {
                if (err) {
                    console.error('Error updating member: ', err);
                    reject(err);
                } else {
                    console.log(`Row(s) updated: ${this.changes}`);
                    resolve(this.changes);
                }
            });
        });
    }

    // Delete: delete member by id
    async deleteMemberById(id) {
        const sql = `DELETE FROM Member WHERE id = ?`;

        return new Promise((resolve, reject) => {
            this.db.run(sql, [id], function(err) {
                if (err) {
                    console.error('Error deleting member: ', err);
                    reject(err);
                } else {
                    console.log(`Row(s) deleted: ${this.changes}`);
                    resolve(this.changes);
                }
            });
        });
    }


    
}

export { DatabaseManager };