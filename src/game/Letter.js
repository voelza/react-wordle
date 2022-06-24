import "./Letter.css";

export default function Letter(props) {
    return (
        <div className={`letter letter-status-${props.letter.status}`}>{props.letter.letter}</div>
    );
}