import { useState, useEffect } from 'react';
import './App.css';
import { Greet, GetBackground, GetScene, PlayAudio } from "../wailsjs/go/main/App";
import Character from './components/Character';
import TextBox from './components/TextBox';
import Speaker from './components/Speaker';

function App() {
    const [scene, setScene] = useState(null);
    const [background, setBackground] = useState(null);
    const [dialogueIndex, setDialogueIndex] = useState(0);

    useEffect(() => {
        GetScene("begin").then(scene => {
            setScene(scene);
            setBackground(formatBackground(scene.Background));
        })
    }, [scene]);


    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === "Enter") {
                handleNextDialogue();
            }
        };
        
        window.addEventListener("keydown", handleKeyDown);
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        }
    }, [scene, dialogueIndex]);

    const formatBackground = (bgString) => {
        return bgString.startsWith("@") 
        ? `url(${bgString.substring(1)})`
        : bgString;
    }

    const handleNextDialogue = () => {
        if (scene && scene.Dialogue && dialogueIndex < scene.Dialogue.length - 1) {
            setDialogueIndex(dialogueIndex + 1);
        }
    }
        

    return (
        scene && (
            <div id="App"
                style={{
                    background: background,
                    width: "100vw",
                    height: "100vh",
                    backgroundSize: "cover",
                    zoom: scene.Zoom ? scene.Zoom / 100 : 1,
                }}
            >
                <TextBox 
                    speaker={scene.Dialogue[dialogueIndex]?.Speaker} 
                    text={scene.Dialogue[dialogueIndex]?.Text} 
                    textEffect={scene.Dialogue[dialogueIndex]?.Effect || ""}
                    handleNextDialogue={handleNextDialogue} 
                />
                <Character character={scene.Characters[0]} zIndex={1} />
                <Character character={scene.Characters[1]} zIndex={2} />
                <Speaker source={scene?.BackgroundMusic} />
            </div>
        )
    )
}

export default App
