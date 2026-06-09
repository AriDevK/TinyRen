import { useState, useEffect } from 'react';
// import logo from './assets/images/logo-universal.png';
import './App.css';
import { Greet, GetBackground } from "../wailsjs/go/main/App";

function App() {
    const [background, setBackground] = useState('transparent');

    useEffect(() => {
        GetBackground().then(setBackground);
    }, [])

    return (
        <div id="App"
            style={{
                backgroundColor: background,
                width: "100%",
                height: "100vh",
            }}
        >
        </div>
    )
}

export default App
