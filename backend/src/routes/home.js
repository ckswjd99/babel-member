import express from 'express';

class HomeRouter {
    constructor() { }

    router() {
        const router = express.Router();

        router.get('/', (req, res) => {
            res.sendFile('src/html/home.html', { root: './' });
        });

        return router;
    }
}

export { HomeRouter };