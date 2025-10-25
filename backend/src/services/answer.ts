import { AnswerRepository } from "../db/repositories/answer";

export class AnswerService {
  private answerRepo: AnswerRepository = new AnswerRepository();

  public async getAnswer (quesId: string) {
    try {
      return await this.answerRepo.getAnswer(quesId);
    } catch (error) {
      console.error('Error in answerService.getAnswer -> ', error);
      throw error; 
    }
  }
}