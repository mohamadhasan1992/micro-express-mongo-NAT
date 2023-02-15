import express, {Response, Request, NextFunction} from "express";



const router = express.Router();


router.put('/api/orders/:id', async(req:Request, res: Response, next: NextFunction) => {
    res.send({});
});


export {router as showOrderRouter};

