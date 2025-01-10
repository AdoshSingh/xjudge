import { Question } from "../../models/question";

export class QuestionRepository {

  public async getAllQuestions() {
    try {
      const allQuestions = await Question.find({});
      return allQuestions;
    } catch (error) {
      console.error('Error in questionRepository.getAllQuestions -> ', error);
      throw error;
    }
  }

  public async getQuestion(questId: string) {
    try {
      const question = await Question.findOne({_id: questId});
      return question;
    } catch (error) {
      console.error('Error in questionRepository.getQuestion -> ', error);
      throw error;
    }
  }
}