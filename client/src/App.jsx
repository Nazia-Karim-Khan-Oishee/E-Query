import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Comments from "./pages/comments";
import Login from "./pages/login";
import GetAllQuestions from "./pages/Questions/GetAllQuestions";
import QuestionDetails from "./pages/Questions/QuestionDetails";

import { library } from "@fortawesome/fontawesome-svg-core";

import "./App.css";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/comments" element={<Comments />} />
        <Route path="/" element={<Login />} />
        <Route path="/getAllQuestion" element={<GetAllQuestions />} />
        <Route path="/questions/:id" element={<QuestionDetails />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
