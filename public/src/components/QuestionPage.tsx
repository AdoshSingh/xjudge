import Question from "./ui/Question";
import { apiService } from "@/services/apiService";
import { useParams } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { editor } from "monaco-editor";
import Editor, { OnMount } from "@monaco-editor/react";
import { Button } from "./ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const QuestionPage = () => {
  const { id } = useParams();
  const editorRef = useRef<null | editor.IStandaloneCodeEditor>(null);

  const [question, setQuestion] = useState<any>();
  const [code, setCode] = useState<string>("");
  const [language, setLanguage] = useState<string>("javascript");

  useEffect(() => {
    if (!id) return;
    apiService
      .getQuestion(id)
      .then((data) => {
        console.log(data.data.data);
        setQuestion(data.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [id]);

  const handleEditorDidMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;
  };

  const handleEditorChange = () => {
    console.log(editorRef.current?.getValue());
    setCode(editorRef.current?.getValue() || "");
  };

  const changeLanguage = (value: string) => {
    setLanguage(value);
    editorRef.current?.setValue("");
    setCode("")
  }

  const submitCode = async () => {
    if (!id || !code || !language) {
      alert("Invalid request");
      return;
    }

    try {
      await apiService.submitCode(id, code, language);
      alert("Success");
    } catch (error) {
      console.error("Error in /question/submit post request -->", error);
      alert("Something went wrong");
    }
  };

  return (
    <div className="flex">
      <div className=" w-[50vw]">
        {question && (
          <Question
            title={question.title}
            statement={question.statement}
            examples={question.examples}
            constraints={question.constraints}
            testCases={question.testcases}
          />
        )}
        <Select onValueChange={(value) => changeLanguage(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select a language" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Language</SelectLabel>
              <SelectItem value="javascript">Javscript</SelectItem>
              <SelectItem value="python">Python</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        <Button onClick={submitCode}>Submit</Button>
      </div>

      <Editor
        height="100vh"
        width="50vw"
        defaultLanguage="javascript"
        defaultValue="// some comment"
        onMount={handleEditorDidMount}
        onChange={handleEditorChange}
        theme="vs-dark"
        language={language}
      />
    </div>
  );
};

export default QuestionPage;
