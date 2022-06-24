import { useCallback, useContext } from "react";
import Letter from "./Letter";
import { GameContext } from "./Game";
import "./Word.css";
import { WordleLetterState } from "./Wordle";

export default function Word(props) {
    const { wordle, inputState } = useContext(GameContext);
    const [input] = inputState;
    const letters = useCallback(() => {
        return props.isInInputMode
            ? Array.from({ length: wordle.solution.length }, (_, i) => input[i] ? { letter: input[i], status: WordleLetterState.GRAY } : { letter: ' ', status: WordleLetterState.GRAY })
            : [...props.word];
    }, [props.word, props.isInInputMode, input, wordle.solution]);
    return (
        <div className="word">
            {letters().map((l, i) => <Letter key={i} letter={l}></Letter>)}
        </div>
    )
}