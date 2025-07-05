import AsyncStorage from "@react-native-async-storage/async-storage";
import { Audio } from "expo-av";
import React, { useEffect, useRef, useState } from "react";
import { Dimensions, Image, StyleSheet, Text, TouchableWithoutFeedback, View } from "react-native";

const { width: WIDTH, height: HEIGHT } = Dimensions.get("window");
const lanesX = [WIDTH / 4, WIDTH / 2, (WIDTH * 3) / 4];
const PLAYER_WIDTH = 80;
const PLAYER_HEIGHT = 160;
const ENEMY_WIDTH = 80;
const ENEMY_HEIGHT = 160;

const PlayerCarImg = require("../../assets/carImages/playerCar.png");
const EnemyCarImg = require("../../assets/carImages/enemyCar.png");
const CrashSound = require("../../assets/carImages/car-crash-211710.mp3");
//const carBg = require("../../assets/carImages/carBg.jpg");
//const carBg = require("../../assets/carImages/powerlift1.jpg");
//const carBg = require("../../assets/carImages/image.png");
//const carBg = require("../../assets/carImages/urbunBg.png");
const carBg = require("../../assets/carImages/snowBg.png");




const Player = ({ x, y }) => (
    <Image
        source={PlayerCarImg}
        style={{
            position: "absolute",
            left: x - PLAYER_WIDTH / 2,
            top: y - PLAYER_HEIGHT / 2,
            width: PLAYER_WIDTH,
            height: PLAYER_HEIGHT,
            resizeMode: "contain",
        }}
    />
);

const Enemy = ({ x, y }) => (
    <Image
        source={EnemyCarImg}
        style={{
            position: "absolute",
            left: x - ENEMY_WIDTH / 2,
            top: y - ENEMY_HEIGHT / 2,
            width: ENEMY_WIDTH,
            height: ENEMY_HEIGHT,
            resizeMode: "contain",
        }}
    />
);

const randomLane = () => lanesX[Math.floor(Math.random() * lanesX.length)];

export default function App() {
    const [playerLane, setPlayerLane] = useState(1);
    const [enemies, setEnemies] = useState([]);
    const [score, setScore] = useState(0);
    const [bestScore, setBestScore] = useState(0);
    const [running, setRunning] = useState(true);
    const [paused, setPaused] = useState(false);
    const [speed, setSpeed] = useState(6);
    const crashSound = useRef(new Audio.Sound());
    const [bgY, setBgY] = useState(0);

    useEffect(() => {
        (async () => {
            await crashSound.current.loadAsync(CrashSound);
            const best = await AsyncStorage.getItem("bestScore");
            if (best) setBestScore(parseInt(best));
        })();
    }, []);


    useEffect(() => {
        if (!running || paused) return;
        const interval = setInterval(() => {
            setEnemies((prev) => [
                ...prev,
                { id: Math.random().toString(), x: randomLane(), y: -ENEMY_HEIGHT },
            ]);
        }, 1500);
        return () => clearInterval(interval);
    }, [running, paused]);


    useEffect(() => {
        if (!running || paused) return;
        const speedInterval = setInterval(() => {
            setSpeed((s) => Math.min(s + 0.5, 15));
        }, 3000);
        return () => clearInterval(speedInterval);
    }, [running, paused]);

    useEffect(() => {
        if (!running || paused) return;
        let animationFrameId;
        const update = () => {
            setBgY((prev) => (prev + speed) % HEIGHT);
            setEnemies((prevEnemies) => {
                const updatedEnemies = prevEnemies
                    .map((enemy) => ({ ...enemy, y: enemy.y + speed }))
                    .filter((enemy) => enemy.y < HEIGHT + ENEMY_HEIGHT);
                updatedEnemies.forEach(async (enemy) => {
                    if (
                        Math.abs(enemy.x - lanesX[playerLane]) < PLAYER_WIDTH / 1.5 &&
                        enemy.y + ENEMY_HEIGHT / 2 > HEIGHT - PLAYER_HEIGHT - 10
                    ) {
                        setRunning(false);
                        await crashSound.current.replayAsync();
                        if (score > bestScore) {
                            await AsyncStorage.setItem("bestScore", score.toString());
                            setBestScore(score);
                        }
                        alert("Game Over! Score: " + score);
                    }
                });
                return updatedEnemies;
            });
            setScore((prev) => prev + 1);
            animationFrameId = requestAnimationFrame(update);
        };
        animationFrameId = requestAnimationFrame(update);
        return () => cancelAnimationFrame(animationFrameId);
    }, [playerLane, speed, running, paused, score]);

    const moveLeft = () => {
        if (!running || paused) return;
        setPlayerLane((lane) => Math.max(0, lane - 1));
    };

    const moveRight = () => {
        if (!running || paused) return;
        setPlayerLane((lane) => Math.min(lanesX.length - 1, lane + 1));
    };

    if (!running) {
        return (
            <View style={styles.container}>
                <Text style={styles.gameOverText}>Game Over!</Text>
                <Text style={styles.scoreText}>Score: {score}</Text>
                <Text style={styles.bestscoreText}>Best: {bestScore}</Text>
                <Text
                    style={styles.restartText}
                    onPress={() => {
                        setEnemies([]);
                        setScore(0);
                        setPlayerLane(1);
                        setSpeed(6);
                        setPaused(false);
                        setRunning(true);
                    }}
                >
                    Tap to Restart
                </Text>
            </View>
        );
    }

    return (
        <TouchableWithoutFeedback
            onPress={({ nativeEvent }) => {
                const x = nativeEvent.locationX;
                if (x < WIDTH / 2) moveLeft();
                else moveRight();
            }}
        >
            <View style={styles.container}>
                <Image
                    source={carBg}
                    style={{
                        position: "absolute",
                        top: bgY - HEIGHT,
                        width: WIDTH,
                        height: HEIGHT * 2,
                        resizeMode: "stretch",
                    }}
                />
                <Player x={lanesX[playerLane]} y={HEIGHT - PLAYER_HEIGHT / 2 - 10} />
                {enemies.map((enemy) => (
                    <Enemy key={enemy.id} x={enemy.x} y={enemy.y} />
                ))}
                <Text style={styles.scoreText}>Score: {score}</Text>
                <Text style={styles.instructionText}>Tap left/right to move</Text>
                <Text style={styles.pauseButton} onPress={() => setPaused(!paused)}>
                    {paused ? "▶ Resume" : "⏸ Pause"}
                </Text>
            </View>
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#000",
        overflow: "hidden",
    },
    scoreText: {
        position: "absolute",
        top: 40,
        left: 20,
        color: "white",
        fontSize: 24,
        fontWeight: "bold",
    },
    bestscoreText: {
        position: "absolute",
        top: 70,
        left: 20,
        color: "white",
        fontSize: 24,
        fontWeight: "bold",
    },
    instructionText: {
        position: "absolute",
        bottom: 40,
        alignSelf: "center",
        color: "white",
        fontSize: 18,
    },
    gameOverText: {
        flex: 1,
        fontSize: 36,
        color: "red",
        textAlign: "center",
        marginTop: 200,
    },
    restartText: {
        fontSize: 22,
        color: "white",
        textAlign: "center",
        marginTop: 20,
        textDecorationLine: "underline",
    },
    pauseText: {
        position: "absolute",
        top: 40,
        right: 20,
        color: "yellow",
        fontSize: 18,
        textDecorationLine: "underline",
    },
    pauseButton: {
        position: "absolute",
        top: 40,
        right: 20,
        color: "white",
        fontSize: 20,
        fontWeight: "bold",
        backgroundColor: "rgba(0,0,0,0.5)",
        padding: 10,
        borderRadius: 10,
    },
});
