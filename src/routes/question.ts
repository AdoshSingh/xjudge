import { Request, Response, Router } from "express";
import { MessagingQueue } from '../services/messaging';

const router = Router();

router.post('/submit', async (req: Request, res: Response) => {
  try {
    const {code, question} = req.body;

    const msgQ = new MessagingQueue(); 
    await msgQ.pushToQueue('codeQueue', req.body);

    res.status(200).json({message: 'Success'});
  } catch (error) {
    console.error('Error in /question/submit post request -->', error);
    res.status(500).json({error: 'Something went wrong'});
  }
})

export default router;