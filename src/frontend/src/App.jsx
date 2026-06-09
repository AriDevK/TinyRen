import { useState, useEffect } from 'react';
import './App.css';
import { Greet, GetBackground, GetScene } from "../wailsjs/go/main/App";
import Character from './components/Character';

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
                width: "100vw",
                height: "100vh",
                backgroundSize: "cover",
            }}
        >
            <Character character={scene && scene.Characters[0]} zIndex={1} />
            <Character character={scene && scene.Characters[1]} zIndex={2} />
        </div>
    )
}

export default App
