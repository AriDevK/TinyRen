import './TextBox.css';

export default function TextBox({ speaker, text, handleNextDialogue }) {
    return (
        <div className="textBox">
            <div className="speaker">{speaker}:</div>
            <p className="text">{text}</p>
            <button onClick={handleNextDialogue} className="nextButton">
                &gt;
            </button>
        </div>
    )
}