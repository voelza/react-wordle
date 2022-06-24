import { useCallback, useContext, useEffect, useState } from "react";
import { GameContext } from "./Game";
import "./Keyboard.css";

export default function Keyboard() {
    const { wordle, gameOverState, inputState, gameState } = useContext(GameContext);
    const [gameOver] = gameOverState;
    const [input, setInput] = inputState;
    const [, setState] = gameState;

    const handleKeyInput = useCallback((key) => {
        if (gameOver) {
            return;
        }
        if (input.length < wordle.solution.length) {
            setInput(input + key.toLowerCase());
        }
    }, [gameOver, input, setInput, wordle.solution]);

    const handleBackspace = useCallback(() => {
        if (gameOver) {
            return;
        }
        if (input.length > 0) {
            setInput(input.substring(0, input.length - 1));
        }
    }, [gameOver, setInput, input]);

    const handleEnter = useCallback(() => {
        if (gameOver) {
            return;
        }
        setState(wordle.guess(input));
    }, [gameOver, input, setState, wordle]);


    useEffect(() => {
        function handleInput(e) {
            if (e.code.startsWith("Key")) {
                handleKeyInput(e.key);
            } else if (e.code === "Backspace") {
                handleBackspace();
            } else if (e.code === "Enter") {
                handleEnter();
            }
        }

        window.addEventListener('keydown', handleInput);
        return function cleanup() {
            window.removeEventListener('keydown', handleInput);
        }
    }, [handleBackspace, handleEnter, handleKeyInput]);

    const [firstRow] = useState([..."qwertyuiop"]);
    const [secondRow] = useState([..."asdfghjkl"]);
    const [thirdRow] = useState([..."zxcvbnm"]);
    const keys = wordle.guesses.flatMap(g => Array.from(g));
    const getUsedKeyClass = useCallback((key) => {
        const k = keys.find(c => c.letter === key);
        if (k) {
            return `key-${k.status}`;
        }
        return "";
    }, [keys]);
    return (
        <div className="keyboard">
            <div className="keyboard-row">
                {firstRow.map(c => <div key={c} className={`key ${getUsedKeyClass(c)}`} onClick={() => handleKeyInput(c)}>{c}</div>)}
            </div>
            <div className="keyboard-row">
                {secondRow.map(c => <div key={c} className={`key ${getUsedKeyClass(c)}`} onClick={() => handleKeyInput(c)}>{c}</div>)}
            </div>
            <div className="keyboard-row">
                <div className="key" onClick={handleEnter}>Enter</div>
                {thirdRow.map(c => <div key={c} className={`key ${getUsedKeyClass(c)}`} onClick={() => handleKeyInput(c)}>{c}</div>)}
                <div className="key" onClick={handleBackspace}>⌫</div>
            </div>
        </div >
    );
}