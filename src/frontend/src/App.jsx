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
                width: "100vw",
                height: "100vh",
                backgroundSize: "cover",
            }}
        >
            <div id="character-sprite"
                style={{
                    position: "absolute",
                    bottom: 0,
                    left: "50%",
                    transform: "translateX(-50%)",
                    zIndex: 1,
                    maxHeight: "100%",
                    zoom: "0.8",
                }}
            >
                {scene && scene.Characters.map((character, index) => (
                    <img key={index} src={character.Sprite.replace('@', '')} alt={character.Name} />
                ))}
            </div>
        </div>
    )
}

export default App
