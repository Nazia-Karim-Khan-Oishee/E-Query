import Signup from "./components/Authentication/Signup";
import Navbar from "./components/Navbar";

import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Comments from "./pages/comments";
import Login from "./components/Authentication/Login";
import GetAllQuestions from "./pages/Questions/GetAllQuestions";
import QuestionDetails from "./pages/Questions/QuestionDetails";
import UploadQuestionForm from "./pages/Questions/UploadQuestionForm";
import Profile from "./pages/profile/Profile";
import ResourceForm from "./pages/Resource/UploadResourceForm";

import GetAllResources from "./pages/Resource/getAllResources";
import "./App.css";
function App() {
  return (
    <div>
      <div>
        <Navbar />
      </div>
      <BrowserRouter>
        <div className="Components">
          <Routes>
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Login />} />
            <Route path="/comments" element={<Comments />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/getAllQuestion" element={<GetAllQuestions />} />
            <Route path="/getAllResources" element={<GetAllResources />} />
            <Route path="/questions/:id" element={<QuestionDetails />} />
            <Route path="/createQuestion" element={<UploadQuestionForm />} />
            <Route path="/createResource" element={<ResourceForm />} />
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
