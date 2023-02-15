import express, {Response, Request, NextFunction} from "express";



const router = express.Router();


router.delete('/api/orders/:id', async(req:Request, res: Response, next: NextFunction) => {
    res.send({});
});


export {router as deleteOrderRouter};

