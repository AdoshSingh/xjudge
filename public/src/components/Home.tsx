import { apiService } from "@/services/apiService";
import { useEffect, useState } from "react";
import Card from "./Card";

type Example = {
  input: string;
  output: string;
};

type Question = {
  title: string;
  statement: string;
  examples: Example[];
  constraints: string[];
  testCases: string[];
};

const Home = () => {

  const [questions, setQuestions] = useState<Question[]>([]);

  useEffect(() => {
    apiService.getAllQuestions() 
      .then((data) => {
        console.log(data.data.data);
        setQuestions(data.data.data);
      })
      .catch((err) => {
        console.log(err);
      })
  }, [])

  return (
    <div>
      {questions?.map((ele) => {
        return (
          <Card title={ele.title}/>
        )
      })}
    </div>
  )
}

export default Home
