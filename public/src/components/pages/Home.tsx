import { apiService } from "@/services/apiService";
import { useEffect, useState } from "react";
import Card from "../Card";

type Example = {
  input: string;
  output: string;
};

type Question = {
  _id: string;
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
        setQuestions(data.data);
      })
      .catch((err) => {
        console.log(err);
      })
  }, [])

  return (
    <div>
      {questions?.map((ele) => {
        return (
          <Card key={ele._id} title={ele.title} id={ele._id}/>
        )
      })}
    </div>
  )
}

export default Home
