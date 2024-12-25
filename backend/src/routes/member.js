// router that handles requests for member CRUD operations

import express from 'express';

class MemberRouter {
    constructor(dbManager) {
        this.dbManager = dbManager;
    }

    /**
     * GET /members: get all members matching query, or all members if no query
     * GET /members/:id: get member with id
     * POST /members: create new member, data given in request body
     * PUT /members/:id: update member with id, data given in request body
     * DELETE /members/:id: delete member with id
     * 
     * Every queries should be given to manager methods in a object form (column-name: value)
     * 
     * Member columns: name, gender, birthyear, job, major, speciality1, speciality2, funnel,
     * bookInteresting, bookRecently, purpose, everBookClub, memo, enrolledAt
     */

    router() {
        const router = express.Router();

        router.get('/', async (req, res) => {
            if (Object.keys(req.query).length === 0) {
                const members = await this.dbManager.getAllMembers();
                res.json(members);
            } else {
                const members = await this.dbManager.getMembersByColumnValues(req.query);
                res.json(members);
            }
        });

        router.get('/:id', async (req, res) => {
            const member = await this.dbManager.getMemberById(req.params.id);
            res.json(member);
        });

        router.post('/', async (req, res) => {
            console.log(req.body);
            const member = await this.dbManager.createMember(req.body);
            res.json(member);
        });

        router.put('/:id', async (req, res) => {
            const member = await this.dbManager.updateMemberById(req.params.id, req.body);
            res.json(member);
        });

        router.delete('/:id', async (req, res) => {
            const member = await this.dbManager.deleteMemberById(req.params.id);
            res.json(member);
        });

        return router;
    }

};

export { MemberRouter };