import words from "./words.json";

export const WordleLetterState = {
    GRAY: 0,
    GREEN: 1,
    YELLOW: 2
};

export const WordleGameState = {
    UNSOLVED: 0,
    WON: 1,
    LOST: 2,
    NOT_IN_WORD_LIST: 3,
    ONGOING: 4
};



const ONE_DAY_IN_MS = 1000 * 60 * 60 * 24;
const dayAtMidnightTime = (date) => {
    date.setHours(0, 0, 0, 0);
    return date.getTime();
}
const today = new Date();
const lastSeen = new Date(JSON.parse(localStorage.getItem("react-wordle-last-seen") ?? JSON.stringify(today)));
localStorage.setItem("react-wordle-last-seen", JSON.stringify(today));
const WORD_INDEX = Math.round((dayAtMidnightTime(today) - dayAtMidnightTime(new Date("2022-06-04T00:00:00"))) / ONE_DAY_IN_MS);

export class Wordle {
    constructor() {
        this.solution = words[WORD_INDEX];
        this.guesses = function () {
            const history = localStorage.getItem("react-wordle-history");
            return history ? JSON.parse(history) : [];
        }();
        this.totalGuesses = 6;
        this.currentGuesses = this.guesses.length;
        this.gameWon = this.guesses.length > 0 ? this.guesses[this.guesses.length - 1].map(g => g.letter).join("") === this.solution : false;
        this.gameOver = this.guesses.length === this.totalGuesses || this.gameWon;

        if (dayAtMidnightTime(lastSeen) - dayAtMidnightTime(today) !== 0) {
            this.guesses = [];
            this.saveGuesses();
            this.currentGuesses = 0;
            this.gameWon = false;
            this.gameOver = false;
        }
    }

    saveGuesses() {
        localStorage.setItem("react-wordle-history", JSON.stringify(this.guesses));
    }

    guess(word) {
        if (this.currentGuesses >= this.totalGuesses) {
            return WordleGameState.ONGOING;
        }

        if (!words.includes(word)) {
            return WordleGameState.NOT_IN_WORD_LIST;
        }

        this.currentGuesses++;
        const guess = [...word].map((c, i) => {
            const solutionC = this.solution.charAt(i);
            let status = WordleLetterState.GRAY;
            if (c === solutionC) {
                status = WordleLetterState.GREEN;
            } else {
                const letterIndexes = [...this.solution]
                    .map((k, j) => ({ char: k, index: j }))
                    .filter((v) => v.char === c);
                if (letterIndexes.length > 0) {
                    if (letterIndexes.length === 1 && word[letterIndexes[0].index] !== letterIndexes[0].char) {
                        status = WordleLetterState.YELLOW;
                    } else if (letterIndexes.some(v => word[v.index] !== v.char)) {
                        status = WordleLetterState.YELLOW;
                    }
                }
            }

            return {
                letter: c,
                status
            };
        });
        this.guesses.push(guess);
        this.saveGuesses();

        let gameState = WordleGameState.UNSOLVED;
        if (word.toLowerCase() === this.solution) {
            gameState = WordleGameState.WON;
        } else if (this.currentGuesses >= this.totalGuesses) {
            gameState = WordleGameState.LOST;
        }

        return gameState;
    }
}