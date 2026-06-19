import { useNavigate } from 'react-router-dom'; 
import { ShowExitMessage } from "../../wailsjs/go/main/App";


export default function Exit() {
    const navigate = useNavigate();

    return (
        <button 
            onClick={async () => { 
                const shouldExit = await ShowExitMessage();
                if (shouldExit) {
                    navigate('/');
                }
            }}
            style={{ position: "absolute", top: 10, right: 10, zIndex: 1000 }}
        >
            Exit
        </button>
    )
}