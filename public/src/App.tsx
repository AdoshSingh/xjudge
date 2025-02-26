import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/pages/Home";
import QuestionPage from "./components/pages/QuestionPage";

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
