import './TextBox.css';
import { useEffect } from 'react';

export default function TextBox({ speaker, text, textEffect, handleNextDialogue }) {
    return (
        <div className="textBox">
            <div className="speaker">{speaker}:</div>
            <p className={`text text${textEffect}`}>{text}</p>
            <button onClick={handleNextDialogue} className="nextButton">
                &gt;
            </button>
        </div>
    )
}