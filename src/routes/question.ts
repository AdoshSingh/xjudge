import { Request, Response, Router } from "express";
import { messagingQueue } from "../services/queue/messaging";
import { QuestionService } from "../services/question";

const router = Router();
const questionService = new QuestionService();

router.get('/', async (req: Request, res: Response) => {
  try {
    const quesId = req.query.quesid as string;
    const questions = await questionService.getQuestions(quesId);
    res.status(200).json({data: questions});
  } catch (error) {
    console.error('GET /question --> Error:', error);
    res.status(500).json({data: 'Something went wrong!'});
  }
});

router.post('/submit', async (req: Request, res: Response) => {
  try {
    const {code, question} = req.body;

    await messagingQueue.pushToQueue('codeQueue', req.body);

    res.status(200).json({message: 'Success'});
  } catch (error) {
    console.error('Error in /question/submit post request -->', error);
    res.status(500).json({error: 'Something went wrong'});
  }
});

export default router;