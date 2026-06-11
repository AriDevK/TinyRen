import { useState, useEffect } from 'react';
import './App.css';
import { GetBackground, GetScene, PlayAudio, SetVar, GetVars } from "../wailsjs/go/main/App";
import Character from './components/Character';
import TextBox from './components/TextBox';
import Speaker from './components/Speaker';
import QuestionBox from './components/QuestionBox';
import TextInput from './components/TextInput';


function App() {
    const [vars, setVars] = useState({});
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

            GetVars().then(vars => {
                setVars(vars);
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
        return s?.Dialogue[dIndex];
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
        scene && background && dialogue && vars && (
            <div id="App"
                style={{
                    background: background,
                    zoom: scene.Zoom ? scene.Zoom / 100 : 1,
                    width: "100vw",
                    height: "100vh",
                    backgroundSize: "cover",
                }}
            >

                <p style={{ color: "white", position: "absolute", top: 10, left: 10, zIndex: 1000 }}>
                    {vars.player?.name}
                </p>

                {
                    dialogue?.Type === "input" ? 
                    (
                        <TextInput 
                            label={dialogue.Input.Label} 
                            value="" 
                            placeholder={dialogue.Input.Placeholder}
                            onSubmit={(value) => {
                                if (dialogue.Input.OnSubmitSet) {
                                    let [varName, varValue] = dialogue.Input.OnSubmitSet.split("=");
                                    varValue = varValue.replace("<input>", `${value}`);
                                    SetVar(varName, varValue)
                                        .then(() => {
                                            GetVars().then(vars => {
                                                console.log("Vars after setting:", vars);
                                                setVars(vars);
                                            });
                                        })
                                        .catch(err => {
                                            console.error(`Error setting variable: ${err}`);
                                        });
                                }

                                if (dialogue.Input.OnSubmitGoTo) handleGoTo(dialogue.Input.OnSubmitGoTo);
                                else handleNextDialogue();
                            }}
                        />
                    ) 
                    :dialogue?.Type === "ask" ? (
                        <QuestionBox
                            question={dialogue?.Ask?.Question}
                            options={dialogue?.Ask?.Options}
                            handleOptionSelect={handleGoTo}
                        />
                    ) 
                    : (
                        <TextBox
                            speaker={dialogue?.Speaker}
                            text={dialogue?.Say?.Text}
                            textEffect={dialogue?.Say?.Effect}
                            handleNextDialogue={handleNextDialogue}
                            vars={vars}
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
