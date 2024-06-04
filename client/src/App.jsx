import { BrowserRouter, Routes, Route } from "react-router-dom";
import Signup from "./components/Authentication/Signup";
import Login from "./components/Authentication/Login";
import Navbar from "./components/Navbar";
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
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
