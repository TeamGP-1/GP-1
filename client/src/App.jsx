import { BrowserRouter, Route, Routes } from "react-router";
import Login from "../src/views/Login";
import Register from "./views/Register";
import Home from "./views/Home";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Home />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
