import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const Positions = () => {
    const [players, setPlayers] = useState([
        { id: 1, points: 0 },
        { id: 2, points: 0 },
        { id: 3, points: 0 },
        { id: 4, points: 0 },
        { id: 5, points: 0 },
        { id: 6, points: 0 },
        { id: 7, points: 0 },
        { id: 8, points: 0 },
    ]);

    useEffect(() => {
        const interval = setInterval(() => {
            setPlayers((prevPlayers) => {
                const updatedPlayers = prevPlayers.map((player) => ({
                    ...player,
                    points: player.points + Math.floor(Math.random() * 100),
                }));

                return [...updatedPlayers].sort((a, b) => b.points - a.points);
            });
        }, 3000);

        return () => clearInterval(interval);
    }, []);

    const getColor = (index) => {
        if (index < 3) return "bg-[#3CB371] border-green-600";
        if (index < 6) return "bg-[#DAA520] border-yellow-600";
        return "bg-[#FF6347] border-red-600";
    };

    return (
        <div className="relative right-0 flex flex-col items-center justify-center p-1 pt-32 pb-10 w-[100px] text-center">
            <span className="ml-[150px] mb-[50px] flex items-center justify-center text-[24px] w-[250px] h-[50px]  text-white font-bold rounded-full bg-[#e68a60e1] border-[4px] border-[#bd95458a] shadow-md shadow-zinc-600">
                Batter
            </span>
            {players.map((player, index) => (
                <div
                    key={player.id}
                    className="absolute left-0 right-0 transition-transform duration-500 ease-in-out"
                    style={{
                        transform: `translateY(${index * 60 + 40}px)`,
                    }}
                >
                    <span
                        className={`flex items-center justify-center text-[16px] w-[250px] h-[50px] text-white font-bold rounded-full border-[4px] shadow-md shadow-zinc-600 ${getColor(
                            index
                        )}`}
                    >
                        {player.points} pts to {index + 1} position
                    </span>
                </div>
            ))}
        </div>
    );
};

export default Positions;
