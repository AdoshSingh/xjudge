import { Request, Response, Router } from "express";
import { messagingQueue } from "../services/queue/messaging";
import { QuestionService } from "../services/question";
import { AnswerService } from "../services/answer";

const router = Router();
const questionService = new QuestionService();
const answerService = new AnswerService();

router.get("/", async (req: Request, res: Response) => {
  try {
    const quesId = req.query.quesid as string;
    const questions = await questionService.getQuestions(quesId);
    res.status(200).json({ data: questions });
  } catch (error) {
    console.error("GET /question --> Error:", error);
    res.status(500).json({ data: "Something went wrong!" });
  }
});

router.post("/submit", async (req: Request, res: Response) => {
  try {
    const { code, questionId, language } = req.body;

    console.log("Payload received -->", req.body);

    if (!code || !questionId || !language) {
      res.status(400).json({ error: "Invalid request" });
      return;
    }

    const question = await questionService.getQuestions(questionId);
    const answer = await answerService.getAnswer(questionId);

    if (!question || !answer) {
      res.status(404).json({ error: "Question not found" });
      return;
    }

    const testcases = Array.isArray(question)
      ? question[0]?.testcases
      : question?.testcases;

    let finalAnswer = "";
    if (language === "python") {
      finalAnswer = code + "\n" + answer?.program.python;
    } else if (language === "javascript") {
      finalAnswer = code + "\n" + answer?.program.javascript;
    } else {
      res.status(400).json({ error: "Language not supported" });
      return;
    }
    await messagingQueue.pushToQueue("codeQueue", {
      code: finalAnswer,
      questionId,
      language,
      userId: "user1",
      testcases,
    });

    res.status(200).json({ message: "Success" });
  } catch (error) {
    console.error("Error in /question/submit post request -->", error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

export default router;
