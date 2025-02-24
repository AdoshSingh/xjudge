import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import QuestionPage from "./components/QuestionPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/ques/:id" element={<QuestionPage />} />
      </Routes>
    </Router>
  );
}

export default App;
