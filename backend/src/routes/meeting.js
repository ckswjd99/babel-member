import express from 'express';

class MeetingRouter {
    constructor(dbManager) {
        this.dbManager = dbManager;
    }

    /**
     * GET /meetings: get all meetings matching query, or all meetings if no query
     * GET /meetings/:id: get meeting with id
     * POST /meetings: create new meeting, data given in request body
     * PUT /meetings/:id: update meeting with id, data given in request body
     * DELETE /meetings/:id: delete meeting with id
     * 
     * GET /meetings/:id/members: get all members of meeting with id
     * POST /meetings/:id/members/:memberId: register existing member to meeting with id
     * DELETE /meetings/:id/members/:memberId: unregister existing member with memberId from meeting with id
     * 
     * Every queries should be given to manager methods in a object form (column-name: value)
     * 
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
                const meetings = await this.dbManager.getMeetings(req.query);
                res.json(meetings);
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        });

        router.get('/:id', async (req, res) => {
            try {
                const meeting = await this.dbManager.getDetailedMeetingById(req.params.id);
                if (meeting) {
                    res.json(meeting);
                } else {
                    res.status(404).json({ error: 'Meeting not found' });
                }
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        });

        router.post('/', async (req, res) => {
            try {
                const newMeeting = await this.dbManager.createMeeting(req.body);
                res.status(201).json(newMeeting);
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        });

        router.put('/:id', async (req, res) => {
            try {
                const updatedMeeting = await this.dbManager.updateMeeting(req.params.id, req.body);
                if (updatedMeeting) {
                    res.json(updatedMeeting);
                } else {
                    res.status(404).json({ error: 'Meeting not found' });
                }
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        });

        router.delete('/:id', async (req, res) => {
            try {
                const deleted = await this.dbManager.deleteMeeting(req.params.id);
                if (deleted) {
                    res.status(204).end();
                } else {
                    res.status(404).json({ error: 'Meeting not found' });
                }
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        });

        router.get('/:id/members', async (req, res) => {
            try {
                const members = await this.dbManager.getMeetingMembers(req.params.id);
                res.json(members);
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        });

        router.post('/:id/members/:memberId', async (req, res) => {
            try {
                const newMember = await this.dbManager.registerMemberToMeeting(req.params.id, req.params.memberId);
                res.status(201).json(newMember);
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        });

        router.delete('/:id/members/:memberId', async (req, res) => {
            try {
                const deleted = await this.dbManager.unregisterMemberFromMeeting(req.params.id, req.params.memberId);
                if (deleted) {
                    res.status(204).end();
                } else {
                    res.status(404).json({ error: 'Member not found' });
                }
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        });

        return router;
    }
}

export { MeetingRouter };
