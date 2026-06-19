import "./Character.css"
import "../animations.css"
import { useState, useEffect } from "react";
import { GetCharacterAnimationData, GetCharacterSprite } from "../../wailsjs/go/main/App";

export default function Character({ character, zIndex, isTalking }) {

    const [animation, setAnimation] = useState("fade");
    const [sprite, setSprite] = useState(null);
    const [animationDuration, setAnimationDuration] = useState("3s");

    useEffect(() => {
        if (!character) return;

        if (character.Sprite) {
            GetCharacterSprite(character)
            .then(spritePath => {
                if (spritePath) {
                    setSprite(spritePath);
                } else {
                    console.warn(`No sprite found for character: ${character.Name}`);
                }
            });
        }
        
        if (!character.Animation) return;
        GetCharacterAnimationData(character.Name)
        .then(animationData => {
            if (animationData) {
                const { Animation, Duration } = animationData;
                setAnimation(Animation);
                setAnimationDuration(Duration);
            } else {
                console.warn(`No animation data found for character: ${character.Name}`);
            }
        });
    }, [character, isTalking]);


    return (
        character && (
            <div id="character-sprite"
                className={`characterSprite ${isTalking ? 'talking' : ''}`}
                style={{
                    zIndex: isTalking ? zIndex + 10 : zIndex,
                    animation: `${animation} ${animationDuration} ease-in-out forwards`,
                }}
            >
                <img
                    key={character.Name}
                    src={sprite} 
                    alt={character.Name} />
            </div>
        )
    )
}
