import React from "react";
import ScoreBar from "./screens/ScoreBar";
import Positions from "./screens/Positions";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter, Router, Route, Routes } from "react-router-dom";

import "./index.css";

const App = () => {
    return (
      <BrowserRouter>
      <Routes>
        <Route path="/" element={<ScoreBar/>}/>
        <Route path="/player" element={<Positions/>}/>

      </Routes>
      </BrowserRouter>
        // <div className="position-relative">
        //      <div className="position-fixed top-0 end-40 mt-3   ">
        //         <Positions />
        //     </div>

        //      <div className="position-fixed bottom-0 start-0 end-0">
        //         <ScoreBar />
        //     </div>
        // </div>
    );
};

export default App;
