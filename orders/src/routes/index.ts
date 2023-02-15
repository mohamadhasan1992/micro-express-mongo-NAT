import express, {Response, Request, NextFunction} from "express";



const router = express.Router();


router.get('/api/orders', async(req:Request, res: Response, next: NextFunction) => {
    res.send({});
});


export {router as indexOrderRouter};

