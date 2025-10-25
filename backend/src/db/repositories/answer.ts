import { Answer } from "../../models/answer";

export class AnswerRepository {

  public async getAnswer(questId: string) {
    try {
      const answer = await Answer.findOne({quesId: questId});
      return answer;
    } catch (error) {
      console.error('Error in answerRepository.getAnswer -> ', error);
      throw error;
    }
  }
}