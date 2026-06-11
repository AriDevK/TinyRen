import './TextBox.css';
import { useEffect, useState } from 'react';
import _ from 'lodash';

export default function TextBox({ speaker, text, textEffect, handleNextDialogue, vars }) {

    const [displayedText, setDisplayedText] = useState("");

    useEffect(() => {
        if (!text) return;
        setDisplayedText(text);

        if (!vars) return;
        const regexVar = /\$\{([^}]+)\}/g;
        let newText = text;
        let match;
        while ((match = regexVar.exec(text)) !== null) {
            const varName = match[1].replace("vars.", "");
            const varValue = _.get(vars, varName, "");
            newText = newText.replace(match[0], varValue);
        }
        

        setDisplayedText(newText);
    }, [text, vars]);


    return (
        <div className="textBox">
            <div className="speaker">{speaker}:</div>
            <p className={`text text${textEffect}`}>{displayedText}</p>
            <button onClick={handleNextDialogue} className="nextButton">
                &gt;
            </button>
        </div>
    )
}