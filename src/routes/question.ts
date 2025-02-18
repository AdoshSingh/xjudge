import { Request, Response, Router } from "express";
import { messagingQueue } from "../services/queue/messaging";
import { QuestionService } from "../services/question";
import { AnswerService } from "../services/answer";

const router = Router();
const questionService = new QuestionService();
const answerService = new AnswerService();

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
    const {code, questionId, lang} = req.body;

    if (!code || !questionId || !lang) {
      res.status(400).json({error: 'Invalid request'});
      return;
    }

    const answer = await answerService.getAnswer(questionId);
    let finalAnswer = "";
    if(lang === 'python') {
      finalAnswer =  code + answer?.program.python;
    } else if(lang === 'javascript') {
      finalAnswer = code + answer?.program.javascript;
    }
    await messagingQueue.pushToQueue('codeQueue', {code: finalAnswer, questionId, lang});

    res.status(200).json({message: 'Success'});
  } catch (error) {
    console.error('Error in /question/submit post request -->', error);
    res.status(500).json({error: 'Something went wrong'});
  }
});

export default router;