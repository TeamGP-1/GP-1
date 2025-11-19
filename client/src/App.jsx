import { BrowserRouter, Route, Router, Routes } from "react-router";
import Login from "../src/views/Login";
import Register from "./views/Register";
import Home from "./views/Home";
import BaseLayout from "./views/BaseLayout";
import GameLobby from "./views/GameLobby";
import CreateRoom from "./views/CreateRoom";
import JoinRoom from "./views/JoinRoom";
import GameRoom from "./views/GameRoom";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route element={<BaseLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/game" element={<GameLobby />} />
            <Route path="/game/create" element={<CreateRoom />} />
            <Route path="/game/join" element={<JoinRoom />} />
            <Route path="/game/room/:roomId" element={<GameRoom />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
