import { useState, useEffect } from 'react';
import './App.css';
import { Greet, GetBackground, GetScene, PlayAudio } from "../wailsjs/go/main/App";
import Character from './components/Character';
import TextBox from './components/TextBox';
import Speaker from './components/Speaker';
import QuestionBox from './components/QuestionBox';


function App() {
    const [scene, setScene] = useState(null);
    const [background, setBackground] = useState(null);
    const [dialogueIndex, setDialogueIndex] = useState(0);

    useEffect(() => {
        GetScene("begin").then(scene => {
            setScene(scene);
            setBackground(formatBackground(scene.Background));
            setDialogueIndex(0);
        })
    }, []);


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
        setDialogueIndex(prev => {
            if (!scene || !scene.Dialogue) return prev;
            if (prev < scene.Dialogue.length - 1) return prev + 1;
            return prev;
        });
    }

    const handleGetDialogue = () => {
        const dialogueSection = scene?.Dialogue[dialogueIndex];
        if (dialogueSection) {
            const hasQuestion = dialogueSection?.Ask?.Question && dialogueSection?.Ask?.Options && dialogueSection?.Ask?.Options.length > 0;
            if (hasQuestion) {
                return {
                    isQuestion: true,
                    ...dialogueSection
                }
            } else {
                return {
                    isQuestion: false,
                    ...dialogueSection
                }
            }
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


                {
                    handleGetDialogue()?.isQuestion ? (
                        <QuestionBox
                            question={handleGetDialogue().Ask?.Question}
                            options={handleGetDialogue().Ask?.Options}
                            handleOptionSelect={(option) => console.log("Selected option:", option)}
                        />
                    ) : (
                        <TextBox
                            speaker={handleGetDialogue().Speaker}
                            text={handleGetDialogue().Say?.Text}
                            textEffect={handleGetDialogue().Say?.Effect}
                            handleNextDialogue={handleNextDialogue}
                        />
                    )
                }

                {(() => {
                    const currentSpeaker = handleGetDialogue().Speaker;
                    return (
                        <>
                            <Character character={scene.Characters[0]} zIndex={1} isTalking={currentSpeaker === scene.Characters[0]?.Name} />
                            <Character character={scene.Characters[1]} zIndex={2} isTalking={currentSpeaker === scene.Characters[1]?.Name} />
                        </>
                    )
                })()}
                {
                    // scene.BackgroundMusic && <Speaker source={scene.BackgroundMusic} />
                }
            </div>
        )
    )
}

export default App
