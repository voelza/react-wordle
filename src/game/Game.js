import { createContext, useCallback, useEffect, useMemo, useState } from "react";
import "./Game.css";
import Keyboard from "./Keyboard";
import { Wordle, WordleGameState, WordleLetterState } from "./Wordle";
import Word from "./Word";
import toast from "./Toaster";

export const GameContext = createContext(null);

export default function Game() {
    const [wordle] = useState(new Wordle());
    const gameOverState = useState(wordle.gameOver);
    const [gameOver, setGameOver] = gameOverState;
    const inputState = useState("");
    const [, setInput] = inputState;

    const words = useCallback(() => {
        const result = [...wordle.guesses];
        for (let i = wordle.guesses.length; i < wordle.totalGuesses; i++) {
            const word = [];
            for (let j = 0; j < wordle.solution.length; j++) {
                word.push({
                    letter: ' ',
                    status: WordleLetterState.GRAY
                });
            }
            result.push(word);
        }
        return result;
    }, [wordle.guesses, wordle.totalGuesses, wordle.solution]);


    const [resultText, setResultText] = useState("");
    const won = useCallback(() => {
        setResultText(`You Won! 😎 The word was "${wordle.solution.toUpperCase()}".`);
        setGameOver(true);
    }, [wordle.solution, setGameOver]);

    const lost = useCallback(() => {
        setResultText(`You Lost! 😢 The word was "${wordle.solution.toUpperCase()}".`);
        setGameOver(true);
    }, [wordle.solution, setGameOver]);


    useEffect(() => {
        if (wordle.gameOver) {
            if (wordle.gameWon) {
                won();
            } else {
                lost();
            }
        }
    }, [lost, won, wordle.gameOver, wordle.gameWon]);

    const gameState = useState(WordleGameState.ONGOING);
    const [state, setState] = gameState;
    useMemo(() => {
        if (state === WordleGameState.ONGOING) {
            return;
        }

        if (state === WordleGameState.NOT_IN_WORD_LIST) {
            toast("Word not in list!", { messageStyle: "text-align: center;", backgroundColor: "#e7f385b8" });
            setState(WordleGameState.ONGOING);
            return;
        }

        if (state === WordleGameState.LOST) {
            lost();
            return;
        }

        if (state === WordleGameState.WON) {
            won();
            return;
        }

        setInput("");
        setState(WordleGameState.ONGOING);
    }, [state, setState, setInput, lost, won]);

    const resultToClipboard = useCallback(() => {
        const header = "Worsle 💀\n";
        const squares = wordle.guesses.map(guess => {
            return guess.map(g => {
                if (g.status === WordleLetterState.GREEN) {
                    return "🟩";
                } else if (g.status === WordleLetterState.YELLOW) {
                    return "🟨";
                }
                return "⬛";
            }).join("");
        }).join("\n");
        navigator.clipboard.writeText(header + squares + "\n" + window.location.href);
        toast("Result was saved to clipboard!", { messageStyle: "text-align: center;", backgroundColor: "#aae1b3d9" });
    }, [wordle.guesses]);;
    return (
        <div className="game">
            <GameContext.Provider value={{ wordle, gameOverState, inputState, gameState }}>
                <div style={
                    {
                        visibility: resultText ? 'visible' : 'hidden',
                        height: '30px'
                    }
                }>
                    {resultText}
                    <button onClick={resultToClipboard} className="share-btn">Share ☍</button>
                </div>
                {
                    words()
                        .map(
                            (w, i) =>
                                <Word
                                    key={i}
                                    word={w}
                                    isInInputMode={wordle.currentGuesses === i && !gameOver}
                                ></Word>
                        )
                }
                <Keyboard />
            </GameContext.Provider>
        </div>
    );
}