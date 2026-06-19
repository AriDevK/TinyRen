import './QuestionBox.css';

export default function QuestionBox({ question, options, handleOptionSelect }) {
    return (
        <div className="questionBox">
            <p className="questionText">{question}</p>
            <div className="optionsContainer">
                {options.map((option, index) => (
                    <button 
                        key={index} 
                        className="optionButton" 
                        onClick={() => handleOptionSelect(option.GoTo)}
                    >
                        {option.Text}
                    </button>
                ))}
            </div>
        </div>
    )
}