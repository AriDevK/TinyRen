import "./Character.css"
import "../animations.css"
import { useState, useEffect } from "react";

export default function Character({ character, zIndex, isTalking }) {

    const [animation, setAnimation] = useState("fade");
    const [animationDuration, setAnimationDuration] = useState("3s");

    useEffect(() => {
        console.log("Character updated:", character);
        if (character) {
            const [_animation, _animationDuration] = character.Animation.split(" ");
            setAnimation(_animation);
            setAnimationDuration(_animationDuration ? _animationDuration : "3s");
        }
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
                    src={character.Sprite.replace('@', '')} alt={character.Name} />
            </div>
        )
    )
}
    