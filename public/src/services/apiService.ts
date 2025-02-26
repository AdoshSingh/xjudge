import axios from "axios";

class ApiService { 
  baseApiUrl = import.meta.env.VITE_BASE_API_URL;

  public async getAllQuestions() {
    const data = await axios.get(`${this.baseApiUrl}/api/question`);
    return data.data;
  }

  public async getQuestion(quesId: string) {
    const data = await axios.get(`${this.baseApiUrl}/api/question?quesid=${quesId}`);
    return data.data;
  }

  public async submitCode(questionId: string, code: string, language: string) {
    const data = await axios.post(`${this.baseApiUrl}/api/question/submit`, {
      code, questionId, language
    });
    console.log(code);
    return data.data;
  }
}

export const apiService = new ApiService();