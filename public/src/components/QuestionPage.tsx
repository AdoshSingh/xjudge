import Question from "./ui/Question";
import { apiService } from "@/services/apiService";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

const QuestionPage = () => {
  const {id} = useParams();

  const [question, setQuestion] = useState();

  useEffect(() => {
    if(!id) return;
    apiService.getQuestion(id)
      .then((data) => {
        console.log(data.data.data);
        setQuestion(data.data.data);
      })
      .catch((err) => {
        console.log(err);
      })
  }, [id]);
  
  return (
    <div>
      
    </div>
  )
}

export default QuestionPage
