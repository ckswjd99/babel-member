import express from 'express';

class QuarterRouter {
    constructor(dbManager) {
        this.dbManager = dbManager;
    }

    /**
     * GET /quarters: get all quarters matching query, or all quarters if no query
     * GET /quarters/:id: get quarter with id
     * POST /quarters: create new quarter, data given in request body
     * PUT /quarters/:id: update quarter with id, data given in request body
     * DELETE /quarters/:id: delete quarter with id
     * 
     * GET /quarters/:id/members: get all members of quarter with id
     * POST /quarters/:id/members/:memberId: register existing member to quarter with id
     * DELETE /quarters/:id/members/:memberId: unregister existing member with memberId from quarter with id
     * 
     * GET /quarters/:id/meetings: get all meetings of quarter with id, matching query if given, or all meetings if no query
     * POST /quarters/:id/meetings: add new meeting to quarter with id, data given in request body
     * PUT /quarters/:id/meetings/:meetingId: update meeting with meetingId for quarter with id, data given in request body
     * DELETE /quarters/:id/meetings/:meetingId: delete meeting with meetingId from quarter with id
     * 
     * Every queries should be given to manager methods in a object form (column-name: value)
     * 
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
     */

    router() {
        const router = express.Router();

        router.get('/', async (req, res) => {
            try {
                const quarters = await this.dbManager.getQuarters(req.query);
                res.json(quarters);
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        });

        router.get('/:id', async (req, res) => {
            try {
                const quarter = await this.dbManager.getQuarterById(req.params.id);
                if (quarter) {
                    res.json(quarter);
                } else {
                    res.status(404).json({ error: 'Quarter not found' });
                }
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        });

        router.post('/', async (req, res) => {
            try {
                const newQuarter = await this.dbManager.createQuarter(req.body);
                res.status(201).json(newQuarter);
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        });

        router.put('/:id', async (req, res) => {
            try {
                const updatedQuarter = await this.dbManager.updateQuarter(req.params.id, req.body);
                if (updatedQuarter) {
                    res.json(updatedQuarter);
                } else {
                    res.status(404).json({ error: 'Quarter not found' });
                }
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        });

        router.delete('/:id', async (req, res) => {
            try {
                const deleted = await this.dbManager.deleteQuarter(req.params.id);
                if (deleted) {
                    res.status(204).end();
                } else {
                    res.status(404).json({ error: 'Quarter not found' });
                }
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        });

        router.get('/:id/members', async (req, res) => {
            try {
                const members = await this.dbManager.getQuarterMembers(req.params.id);
                res.json(members);
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        });

        router.post('/:id/members/:memberId', async (req, res) => {
            try {
                const newMember = await this.dbManager.registerMemberToQuarter(req.params.id, req.params.memberId);
                res.status(201).json(newMember);
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        });

        router.delete('/:id/members/:memberId', async (req, res) => {
            try {
                const deleted = await this.dbManager.unregisterMemberFromQuarter(req.params.id, req.params.memberId);
                if (deleted) {
                    res.status(204).end();
                } else {
                    res.status(404).json({ error: 'Member not found' });
                }
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        });

        router.get('/:id/meetings', async (req, res) => {
            try {
                const meetings = await this.dbManager.getQuarterMeetings(req.params.id, req.query);
                res.json(meetings);
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        });

        router.post('/:id/meetings', async (req, res) => {
            try {
                const newMeeting = await this.dbManager.createQuarterMeeting(req.params.id, req.body);
                res.status(201).json(newMeeting);
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        });

        router.put('/:id/meetings/:meetingId', async (req, res) => {
            try {
                const updatedMeeting = await this.dbManager.updateQuarterMeeting(req.params.id, req.params.meetingId, req.body);
                if (updatedMeeting) {
                    res.json(updatedMeeting);
                } else {
                    res.status(404).json({ error: 'Meeting not found' });
                }
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        });

        router.delete('/:id/meetings/:meetingId', async (req, res) => {
            try {
                const deleted = await this.dbManager.deleteQuarterMeeting(req.params.id, req.params.meetingId);
                if (deleted) {
                    res.status(204).end();
                } else {
                    res.status(404).json({ error: 'Meeting not found' });
                }
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        });

        return router;
    }
}

export { QuarterRouter };