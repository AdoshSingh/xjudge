import { QuestionRepository } from "../db/repositories/question";

export class QuestionService {
  private questionRepo: QuestionRepository = new QuestionRepository();

  public async getQuestions (quesId: string) {
    try {
      if(!quesId) {
        const allQuestions =  await this.questionRepo.getAllQuestions(); 
        console.log(allQuestions);
        return allQuestions;
      }
      return await this.questionRepo.getQuestion(quesId);
    } catch (error) {
      console.error('Error in questionService.getQuestions -> ', error);
      throw error;
    }
  }
}