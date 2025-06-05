import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";  
import '../index.css'

const ScoreBar = () => {
    const [score, setScore] = useState({
        runs: 100,
        wickets: 2,
        overs: 15.2,
        batsman: "Sachin Ghuge",
        bowler: "Aniket Wagh"
    });

    // Simulate score updates for live streaming
    useEffect(() => {
        const interval = setInterval(() => {
            setScore((prevScore) => ({
                ...prevScore,
                runs: prevScore.runs + Math.floor(Math.random() * 10),
                overs: (parseFloat(prevScore.overs) + 0.1).toFixed(1),
            }));
        }, 10000); 

        return () => clearInterval(interval);  
    }, []);

    return (
        <div className="flex justify-around items-center fixed bottom-0 left-0 h-[50px] sm:h-[70px] lg:h-[100px] right-0 bg-gray-800 text-white p-3  placeholder: rounded-full border-[4px] lg:border-[8px] border-[#93a2ae] shadow-xl shadow-zinc-600  w-screen z10 font-sans shadow-text-xl lg:text-2xl">
        <div className="flex flex-col items-center">
            <span className=" text-xs sm:text-xl lg:text-2xl   font-semibold">Score </span>
            <span className="text-base sm:text-lg lg:text-2xl xl:text-3xl font-bold">{score.runs}/{score.wickets}</span>
        </div>
        <div className="flex flex-col items-center">
            <span className=" text-xs sm:text-xl lg:text-2xl  font-semibold">Overs</span>
            <span className="text-base sm:text-lg lg:text-2xl xl:text-3xl font-bold">{score.overs}</span>
        </div>
        <div className="flex flex-col items-center">
            <span className="text-xs sm:text-xl lg:text-2xl  font-semibold">Batsman</span>
            <span className="text-base sm:text-lg lg:text-2xl xl:text-3xl font-bold">{score.batsman}</span>
        </div>
        <div className="flex flex-col items-center">
            <span className="text-xs sm:text-xl lg:text-2xl  font-semibold">Bowler</span>
            <span className="text-base sm:text-lg lg:text-2xl xl:text-3xl font-bold">{score.bowler}</span>
        </div>
    </div>
    );
};

export default ScoreBar;
