import express from 'express';

class ViewRouter {
    constructor() { }

    router() {
        const router = express.Router();

        // when GET request is given, give /src/html/ folder's according file, not just home.html
        router.get('/:file', (req, res) => {
            res.sendFile(`src/html/${req.params.file}`, { root: './' });
        });

        return router;
    }
}

export { ViewRouter };