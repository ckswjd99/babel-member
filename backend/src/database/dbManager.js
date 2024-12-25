import sqlite3 from 'sqlite3';
import {
    createMemberTable,
    createQuarterTable,
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

    // CRUD operations for quarters
    // Create: get every column value except id
    createQuarter(quarter) {
        const { year, quarter: quarterNumber, memo } = quarter;
        const sql = `INSERT INTO Quarter (year, quarter, memo) VALUES (?, ?, ?)`;
        this.db.run(sql, [year, quarterNumber, memo], function(err) {
            if (err) {
                console.error('Error inserting quarter: ', err);
            } else {
                console.log(`A row has been inserted with rowid ${this.lastID}`);
            }
        });
    }

    // Read: get single quarter by id, return quarter object
    async getQuarterById(id) {
        const sql = `SELECT * FROM Quarter WHERE id = ?`;
        return new Promise((resolve, reject) => {
            this.db.get(sql, [id], (err, row) => {
                if (err) {
                    console.error('Error getting quarter: ', err);
                    reject(err);
                } else {
                    resolve(row);
                }
            });
        });
    }

    // Read: get all quarters with matching column values given by object, return array of quarter objects
    async getQuarters(columnValues) {
        const columns = Object.keys(columnValues);
        const values = Object.values(columnValues);
        const sql = columns.length === 0 ? `SELECT * FROM Quarter` : `SELECT * FROM Quarter WHERE ${columns.map(column => `${column} = ?`).join(' AND ')}`;
        return new Promise((resolve, reject) => {
            this.db.all(sql, values, (err, rows) => {
                if (err) {
                    console.error('Error getting quarters: ', err);
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }

    // Update: update quarter by id, set every column value except id
    async updateQuarter(id, columnValues) {
        const columns = Object.keys(columnValues);
        const values = Object.values(columnValues);
        const sql = `UPDATE Quarter SET ${columns.map(column => `${column} = ?`).join(', ')} WHERE id = ?`;
        return new Promise((resolve, reject) => {
            this.db.run(sql, [...values, id], function(err) {
                if (err) {
                    console.error('Error updating quarter: ', err);
                    reject(err);
                } else {
                    resolve(this.changes);
                }
            });
        });
    }

    // Delete: delete quarter by id
    async deleteQuarter(id) {
        try {
            await this.db.run('BEGIN TRANSACTION');
            
            // Delete meeting participants
            await new Promise((resolve, reject) => {
            this.db.run(`DELETE FROM MeetingParticipant WHERE meetingId IN (SELECT id FROM Meeting WHERE quarterId = ?)`, [id], function(err) {
                if (err) {
                console.error('Error deleting meeting participants: ', err);
                reject(err);
                } else {
                resolve(this.changes);
                }
            });
            });

            // Delete meetings
            await new Promise((resolve, reject) => {
            this.db.run(`DELETE FROM Meeting WHERE quarterId = ?`, [id], function(err) {
                if (err) {
                console.error('Error deleting meetings: ', err);
                reject(err);
                } else {
                resolve(this.changes);
                }
            });
            });

            // Delete quarter participants
            await new Promise((resolve, reject) => {
            this.db.run(`DELETE FROM QuarterParticipant WHERE quarterId = ?`, [id], function(err) {
                if (err) {
                console.error('Error deleting quarter participants: ', err);
                reject(err);
                } else {
                resolve(this.changes);
                }
            });
            });

            // Delete the quarter
            await new Promise((resolve, reject) => {
            this.db.run(`DELETE FROM Quarter WHERE id = ?`, [id], function(err) {
                if (err) {
                console.error('Error deleting quarter: ', err);
                reject(err);
                } else {
                resolve(this.changes);
                }
            });
            });

            await this.db.run('COMMIT');
        } catch (err) {
            await this.db.run('ROLLBACK');
            throw err;
        }
        const sql = `DELETE FROM Quarter WHERE id = ?`;
        return new Promise((resolve, reject) => {
            this.db.run(sql, [id], function(err) {
                if (err) {
                    console.error('Error deleting quarter: ', err);
                    reject(err);
                } else {
                    resolve(this.changes);
                }
            });
        });
    }

    // CRUD operations for quarter members
    async getQuarterMembers(quarterId) {
        const sql = `SELECT * FROM Member WHERE id IN (SELECT memberId FROM QuarterParticipant WHERE quarterId = ?)`;
        return new Promise((resolve, reject) => {
            this.db.all(sql, [quarterId], (err, rows) => {
                if (err) {
                    console.error('Error getting members: ', err);
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }

    async registerMemberToQuarter(quarterId, memberId) {
        const sql = `INSERT INTO QuarterParticipant (quarterId, memberId) VALUES (?, ?)`;
        return new Promise((resolve, reject) => {
            this.db.run(sql, [quarterId, memberId], function(err) {
                if (err) {
                    console.error('Error registering member: ', err);
                    reject(err);
                } else {
                    resolve({ id: this.lastID, quarterId, memberId });
                }
            });
        });
    }

    async unregisterMemberFromQuarter(quarterId, memberId) {
        const sql = `DELETE FROM QuarterParticipant WHERE quarterId = ? AND memberId = ?`;
        return new Promise((resolve, reject) => {
            this.db.run(sql, [quarterId, memberId], function(err) {
                if (err) {
                    console.error('Error unregistering member: ', err);
                    reject(err);
                } else {
                    resolve(this.changes);
                }
            });
        });
    }

    // CRUD operations for quarter meetings
    async getQuarterMeetings(quarterId, query) {
        const columns = Object.keys(query);
        const values = Object.values(query);
        const sql = columns.length === 0 ? `SELECT * FROM Meeting WHERE quarterId = ?` : `SELECT * FROM Meeting WHERE quarterId = ? AND ${columns.map(column => `${column} = ?`).join(' AND ')}`;
        return new Promise((resolve, reject) => {
            this.db.all(sql, [quarterId, ...values], (err, rows) => {
                if (err) {
                    console.error('Error getting meetings: ', err);
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }

    async createQuarterMeeting(quarterId, meeting) {
        const { number, date, bookName, bookAuthor, genre, leaderId, paperLink } = meeting;
        const sql = `INSERT INTO Meeting (quarterId, number, date, bookName, bookAuthor, genre, leaderId, paperLink) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
        return new Promise((resolve, reject) => {
            this.db.run(sql, [quarterId, number, date, bookName, bookAuthor, genre, leaderId, paperLink], function(err) {
                if (err) {
                    console.error('Error inserting meeting: ', err);
                    reject(err);
                } else {
                    resolve({ id: this.lastID, quarterId, number, date, bookName, bookAuthor, genre, leaderId, paperLink });
                }
            });
        });
    }

    async updateQuarterMeeting(quarterId, meetingId, meeting) {
        const { number, date, bookName, bookAuthor, genre, leaderId, paperLink } = meeting;
        const sql = `UPDATE Meeting SET number = ?, date = ?, bookName = ?, bookAuthor = ?, genre = ?, leaderId = ?, paperLink = ? WHERE id = ? AND quarterId = ?`;
        return new Promise((resolve, reject) => {
            this.db.run(sql, [number, date, bookName, bookAuthor, genre, leaderId, paperLink, meetingId, quarterId], function(err) {
                if (err) {
                    console.error('Error updating meeting: ', err);
                    reject(err);
                } else {
                    resolve(this.changes);
                }
            });
        });
    }

    async deleteQuarterMeeting(quarterId, meetingId) {
        const sql = `DELETE FROM Meeting WHERE id = ? AND quarterId = ?`;
        return new Promise((resolve, reject) => {
            this.db.run(sql, [meetingId, quarterId], function(err) {
                if (err) {
                    console.error('Error deleting meeting: ', err);
                    reject(err);
                } else {
                    resolve(this.changes);
                }
            });
        });
    }

    // CRUD operations for meeting members
    async getMeetingMembers(meetingId) {
        const sql = `SELECT * FROM Member WHERE id IN (SELECT memberId FROM MeetingParticipant WHERE meetingId = ?)`;
        return new Promise((resolve, reject) => {
            this.db.all(sql, [meetingId], (err, rows) => {
                if (err) {
                    console.error('Error getting members: ', err);
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }

    async registerMemberToMeeting(meetingId, memberId) {
        const sql = `INSERT INTO MeetingParticipant (meetingId, memberId) VALUES (?, ?)`;
        return new Promise((resolve, reject) => {
            this.db.run(sql, [meetingId, memberId], function(err) {
                if (err) {
                    console.error('Error registering member: ', err);
                    reject(err);
                } else {
                    resolve({ id: this.lastID, meetingId, memberId });
                }
            });
        });
    }

    async unregisterMemberFromMeeting(meetingId, memberId) {
        const sql = `DELETE FROM MeetingParticipant WHERE meetingId = ? AND memberId = ?`;
        return new Promise((resolve, reject) => {
            this.db.run(sql, [meetingId, memberId], function(err) {
                if (err) {
                    console.error('Error unregistering member: ', err);
                    reject(err);
                } else {
                    resolve(this.changes);
                }
            });
        });
    }

    // CRUD operations for meetings
    async getMeetings(query) {
        const columns = Object.keys(query);
        const values = Object.values(query);
        const sql = columns.length === 0 ? `SELECT * FROM Meeting` : `SELECT * FROM Meeting WHERE ${columns.map(column => `${column} = ?`).join(' AND ')}`;
        return new Promise((resolve, reject) => {
            this.db.all(sql, values, (err, rows) => {
                if (err) {
                    console.error('Error getting meetings: ', err);
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }

    async getMeetingById(id) {
        const sql = `SELECT * FROM Meeting WHERE id = ?`;
        return new Promise((resolve, reject) => {
            this.db.get(sql, [id], (err, row) => {
                if (err) {
                    console.error('Error getting meeting: ', err);
                    reject(err);
                } else {
                    resolve(row);
                }
            });
        });
    }

    async createMeeting(meeting) {
        const { quarterId, number, date, bookName, bookAuthor, genre, leaderId, paperLink } = meeting;
        const sql = `INSERT INTO Meeting (quarterId, number, date, bookName, bookAuthor, genre, leaderId, paperLink) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
        return new Promise((resolve, reject) => {
            this.db.run(sql, [quarterId, number, date, bookName, bookAuthor, genre, leaderId, paperLink], function(err) {
                if (err) {
                    console.error('Error inserting meeting: ', err);
                    reject(err);
                } else {
                    resolve({ id: this.lastID, quarterId, number, date, bookName, bookAuthor, genre, leaderId, paperLink });
                }
            });
        });
    }

    async updateMeeting(id, meeting) {
        const { quarterId, number, date, bookName, bookAuthor, genre, leaderId, paperLink } = meeting;
        const sql = `UPDATE Meeting SET quarterId = ?, number = ?, date = ?, bookName = ?, bookAuthor = ?, genre = ?, leaderId = ?, paperLink = ? WHERE id = ?`;
        return new Promise((resolve, reject) => {
            this.db.run(sql, [quarterId, number, date, bookName, bookAuthor, genre, leaderId, paperLink, id], function(err) {
                if (err) {
                    console.error('Error updating meeting: ', err);
                    reject(err);
                } else {
                    resolve(this.changes);
                }
            });
        });
    }

    async deleteMeeting(id) {
        const sql = `DELETE FROM Meeting WHERE id = ?`;
        return new Promise((resolve, reject) => {
            this.db.run(sql, [id], function(err) {
                if (err) {
                    console.error('Error deleting meeting: ', err);
                    reject(err);
                } else {
                    resolve(this.changes);
                }
            });
        });
    }

    async getDetailedMeetingById(id) {
        const sql = `
            SELECT 
                Meeting.*, 
                Quarter.year AS quarterYear, 
                Quarter.quarter AS quarterNumber, 
                Member.name AS leaderName, 
                Member.grade AS leaderGrade 
            FROM 
                Meeting 
            JOIN 
                Quarter ON Meeting.quarterId = Quarter.id 
            JOIN 
                Member ON Meeting.leaderId = Member.id 
            WHERE 
                Meeting.id = ?
        `;
        return new Promise((resolve, reject) => {
            this.db.get(sql, [id], (err, row) => {
                if (err) {
                    console.error('Error getting detailed meeting: ', err);
                    reject(err);
                } else {
                    resolve(row);
                }
            });
        });
    }

    async getDetailedMemberById(id) {
        const sql = `
            SELECT 
                Member.*, 
                (SELECT COUNT(*) FROM MeetingParticipant WHERE memberId = Member.id) AS totalMeetings,
                (SELECT COUNT(*) FROM Meeting WHERE leaderId = Member.id) AS leaderCount,
                (SELECT * FROM Meeting WHERE id = (SELECT MAX(meetingId) FROM MeetingParticipant WHERE memberId = Member.id)) AS latestMeeting
            FROM 
                Member 
            WHERE 
                Member.id = ?
        `;
        return new Promise((resolve, reject) => {
            this.db.get(sql, [id], (err, row) => {
                if (err) {
                    console.error('Error getting detailed member: ', err);
                    reject(err);
                } else {
                    resolve(row);
                }
            });
        });
    }
}

export { DatabaseManager };