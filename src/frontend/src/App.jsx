import { useState, useEffect } from 'react';
// import logo from './assets/images/logo-universal.png';
import './App.css';
import { Greet, GetBackground, GetScene } from "../wailsjs/go/main/App";

function App() {
    const [scene, setScene] = useState(null);
    const [background, setBackground] = useState(null);

    useEffect(() => {
        GetScene("begin").then(scene => {
            setScene(scene);
            setBackground(formatBackground(scene.Background));
        })
    }, [scene]);


    const formatBackground = (bgString) => {
        return bgString.startsWith("@") 
        ? `url(${bgString.substring(1)})`
        : bgString;
    }
        

    return (
        <div id="App"
            style={{
                background: background,
                width: "100%",
                height: "100vh",
            }}
        >
        </div>
    )
}

export default App
