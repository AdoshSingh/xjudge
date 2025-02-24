import axios from "axios";

class ApiService { 
  public async getAllQuestions() {
    const data = await axios.get('/api/question');
    return data;
  }

  public async getQuestion(quesId: string) {
    const data = await axios.get(`/api/question?quesid=${quesId}`);
    return data;
  }

  public async submitCode(questionId: string, code: string, language: string) {
    const data = await axios.post('/api/question/submit', {
      code, questionId, language
    });
    console.log(code);
    return data;
  }
}

export const apiService = new ApiService();