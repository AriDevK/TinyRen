import { useState, useEffect } from 'react';
import './App.css';
import { GetBackground, GetScene, PlayAudio } from "../wailsjs/go/main/App";
import Character from './components/Character';
import TextBox from './components/TextBox';
import Speaker from './components/Speaker';
import QuestionBox from './components/QuestionBox';


function App() {
    const [scene, setScene] = useState(null);
    const [background, setBackground] = useState(null);
    const [dialogue, setDialogue] = useState(null);
    const [dialogueIndex, setDialogueIndex] = useState(0);

    useEffect(() => {
        GetScene("begin").then(fetchedScene => {
            setScene(fetchedScene);
            handleInitDialogue(fetchedScene);
            GetBackground().then(bg => {
                setBackground(bg);
            });
        });
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
    }, [scene, dialogueIndex, dialogue]);


    const handleInitDialogue = (sceneArg) => {
        setDialogueIndex(0);
        setDialogue(handleGetDialogue(0, sceneArg));
    }

    const handleNextDialogue = () => {
        setDialogueIndex(prev => {
            let index = prev;
            if (!scene || !scene.Dialogue) index = prev;
            if (prev < scene.Dialogue.length - 1) index = prev + 1;


            const nextDialogue = handleGetDialogue(index);
            if (nextDialogue?.Shown) {
                console.log(`Setting shown for speaker: ${nextDialogue.Speaker} to ${nextDialogue.Shown}`);
                const character = scene.Characters.find(c => c.Name === nextDialogue.Speaker);

                if (nextDialogue?.Shown === "true"){
                    character.Shown = "true";
                } else if (nextDialogue?.Shown === "false") {
                    character.Shown = "false"
                } else {
                    console.warn(`Invalid value for Shown: ${nextDialogue?.Shown}. Expected "true" or "false".`);
                }

                setScene({
                    ...scene,
                    Characters: scene.Characters.map(c => c.Name === character.Name ? character : c)
                });
            }

            setDialogue(nextDialogue);

            return index;
        });
    }

    const handleGetDialogue = (dIndex, sceneArg) => {
        const s = sceneArg ?? scene;
        const dialogueSection = s?.Dialogue[dIndex];
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

        return null;
    }
    
    const handleGoTo = (goTo) => {
        if (!scene || !scene.Dialogue) return;

        console.log(`Handling GoTo: ${goTo}`);

        const targetIndex = scene.Dialogue.findIndex(d => d.ToGo === goTo);
        if (targetIndex !== -1) {
            setDialogueIndex(targetIndex);
            setDialogue(handleGetDialogue(targetIndex));
        } else {
            console.warn(`GoTo label "${goTo}" not found in dialogue.`);
        }
    }

    return (
        scene && background && dialogue && (
            <div id="App"
                style={{
                    background: background,
                    zoom: scene.Zoom ? scene.Zoom / 100 : 1,
                    width: "100vw",
                    height: "100vh",
                    backgroundSize: "cover",
                }}
            >
                {
                    dialogue?.isQuestion ? (
                        <QuestionBox
                            question={dialogue?.Ask?.Question}
                            options={dialogue?.Ask?.Options}
                            handleOptionSelect={handleGoTo}
                        />
                    ) : (
                        <TextBox
                            speaker={dialogue?.Speaker}
                            text={dialogue?.Say?.Text}
                            textEffect={dialogue?.Say?.Effect}
                            handleNextDialogue={handleNextDialogue}
                        />
                    )
                }

                {(() => {
                    const currentSpeaker = dialogue?.Speaker;
                    return scene.Characters.filter(character => character.Shown === "true" || character.Shown === "").map((character, index) => (
                        <Character
                            key={index}
                            character={character}
                            zIndex={index + 1}
                            isTalking={currentSpeaker === character.Name}
                        />
                    ))
                })()}

                {
                    // scene.BackgroundMusic && <Speaker source={scene.BackgroundMusic} />
                }
            </div>
        )
    )
}

export default App
