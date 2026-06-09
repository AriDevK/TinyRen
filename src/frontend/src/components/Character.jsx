import "./Character.css"
import "../animations.css"
import { useState, useEffect } from "react";

export default function Character({ character, zIndex }) {

    const [animation, setAnimation] = useState("fade");
    const [animationDuration, setAnimationDuration] = useState("3s");

    useEffect(() => {
        console.log("Character updated:", character);
        if (character) {
            const [_animation, _animationDuration] = character.Animation.split(" ");
            setAnimation(_animation);
            setAnimationDuration(_animationDuration ? _animationDuration : "3s");
        }
    }, [character]);


    return (
        character && (
            <div id="character-sprite"
                    className="characterSprite"
                    style={{
                        zIndex: zIndex,
                        animation: `${animation} ${animationDuration} ease-in-out forwards`,
                    }}
                >
                <img key={character.Name} src={character.Sprite.replace('@', '')} alt={character.Name} />
            </div>
        )
    )
}
    