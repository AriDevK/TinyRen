import "./TextInput.css";
import { useState } from "react";

export default function TextInput({ label, value, onSubmit, placeholder }) {

    const [inputValue, setInputValue] = useState(value);

     const onChange = (value) => {
        setInputValue(value);
    }

    return (
        <div className="textInputContainer">
            <span className="inputLabel">{label}</span>
            <input 
                type="text" 
                value={inputValue} 
                onChange={e => onChange(e.target.value)} 
                placeholder={placeholder}
                className="textInput"
                autoComplete="off"
                autoFocus={true}
            />
            <button className="submitButton" onClick={() => onSubmit(inputValue)}>
                Ok
            </button>
        </div>
    )
}