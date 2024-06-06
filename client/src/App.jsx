import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Comments from "./pages/comments";
import Navbar from "./components/Navbar";
import Signup from "./components/Authentication/Signup";
import Login from "./components/Authentication/Login";
import ResetPassword from "./components/Authentication/ResetPassword";
import EnterToken from "./components/Authentication/EnterToken";
import GetAllQuestions from "./pages/Questions/GetAllQuestions";
import QuestionDetails from "./pages/Questions/QuestionDetails";
import UploadQuestionForm from "./pages/Questions/UploadQuestionForm";
import ChangePassword from "./components/Authentication/ChangePassword";
import Profile from "./pages/profile/Profile";
import ResourceForm from "./pages/Resource/UploadResourceForm";
import GetQuestions from "./pages/profile/GetQuestions";
import GetAllResources from "./pages/Resource/getAllResources";
import GetResources from "./pages/profile/GetResources";

import { useState } from "react";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <div>
        <Navbar />
      </div>
      <BrowserRouter>
        <div className="Components">
          <Routes>
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Login />} />
            <Route path="/resetPassword" element={<ResetPassword />} />
            <Route path="/enterToken" element={<EnterToken />} />
            <Route path="/changePassword" element={<ChangePassword />} />
            <Route path="/comments" element={<Comments />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/profile/getQuestions" element={<GetQuestions />} />
            <Route path="/profile/getResources" element={<GetResources />} />
            <Route path="/getAllQuestion" element={<GetAllQuestions />} />
            <Route path="/getAllResources" element={<GetAllResources />} />
            <Route path="/questions/:id" element={<QuestionDetails />} />
            <Route path="/createQuestion" element={<UploadQuestionForm />} />
            <Route path="/createResource" element={<ResourceForm />} />
          </Routes>
        </div>
      </BrowserRouter>
    </>
  );
}

export default App;
