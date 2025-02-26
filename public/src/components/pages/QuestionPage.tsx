import Question from "../Question";
import { apiService } from "@/services/apiService";
import { useParams } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { editor } from "monaco-editor";
import Editor, { OnMount } from "@monaco-editor/react";
import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const useSocket = (
  url: string,
  setIsWSReady: (ready: boolean) => void,
  setError: (error: boolean) => void
) => {
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>();
  const retryCountRef = useRef(0);
  const isCleaningUpRef = useRef(false);
  const MAX_RETRIES = 3;
  const INITIAL_BACKOFF = 1000;
  const isConnectionErrorRef = useRef(false);

  const getBackoffDelay = (retryCount: number) => {
    return Math.min(INITIAL_BACKOFF * Math.pow(2, retryCount), 10000);
  };

  useEffect(() => {
    const connectWs = async () => {
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.close();
      }

      try {
        const ws = new WebSocket(url);
        wsRef.current = ws;

        const timeoutId = setTimeout(() => {
          if (ws.readyState !== 1) {
            console.log("Failed to connect to server");
          }
        }, 10000);

        ws.addEventListener("message", (e) => {
          console.log(e.data);
          const data = JSON.parse(e.data);
          if (data.type === "signal" && data.data === "open") {
            const interval = setInterval(() => {
              if (ws.readyState === 1) {
                setIsWSReady(true);
                setError(false);
                if (retryCountRef.current > 0) {
                  console.log("Connection restored");
                }
                retryCountRef.current = 0;
                clearInterval(interval);
              }
            }, 5);
            clearTimeout(timeoutId);
          }
          if (data.type === "error") {
            isConnectionErrorRef.current = true;
            setError(true);
            console.log(data.data);
          }
        });

        ws.onerror = () => {
          clearTimeout(timeoutId);
          setIsWSReady(false);
          console.error("WebSocket connection error.");
        };

        ws.onclose = () => {
          clearTimeout(timeoutId);
          setIsWSReady(false);
          console.log(new Date(), "ws: disconnected");
          if (!isCleaningUpRef.current && !isConnectionErrorRef.current) {
            console.log("connection lost");
            attemptReconnect();
          }
        };
      } catch (error) {
        console.error("WebSocket connection error.", error);
        setIsWSReady(false);
        attemptReconnect();
      }
    };
    const attemptReconnect = () => {
      retryCountRef.current += 1;
      if (retryCountRef.current > MAX_RETRIES) {
        console.log("Max retries reached");
        setError(true);
        console.log("Connection lost");
        return;
      }

      const backOffDelay = getBackoffDelay(retryCountRef.current);
      console.log("Reconnecting in", backOffDelay, "ms");
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      reconnectTimeoutRef.current = setTimeout(() => {
        connectWs();
      }, backOffDelay);
    };

    connectWs();

    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.close();
        isCleaningUpRef.current = true;
        console.log("Cleaning up");
      }
    };
  }, [url, setIsWSReady, setError]);

  return wsRef.current;
};

const QuestionPage = () => {
  const { id } = useParams();
  const editorRef = useRef<null | editor.IStandaloneCodeEditor>(null);

  const [question, setQuestion] = useState<any>();
  const [code, setCode] = useState<string>("");
  const [language, setLanguage] = useState<string>("javascript");

  const [isWSReady, setIsWSReady] = useState(false);
  const [hasError, setHasError] = useState(false);

  const ws = useSocket(
    import.meta.env.VITE_BASE_WS_URL,
    setIsWSReady, 
    setHasError
  );

  useEffect(() => {
    if (!id) return;
    apiService
      .getQuestion(id)
      .then((data) => {
        setQuestion(data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [id]);

  const handleEditorDidMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;
  };

  const handleEditorChange = () => {
    setCode(editorRef.current?.getValue() || "");
  };

  const changeLanguage = (value: string) => {
    setLanguage(value);
    editorRef.current?.setValue("");
    setCode("");
  };

  const submitCode = async () => {
    if (!id || !code || !language) {
      console.log("Invalid request");
      return;
    }

    try {
      await apiService.submitCode(id, code, language);
      console.log("Success");
    } catch (error) {
      console.error("Error in /question/submit post request -->", error);
      console.log("Something went wrong");
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
