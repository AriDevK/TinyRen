import { useEffect, useRef } from 'react';
import { PlayAudio } from "../../wailsjs/go/main/App";

export default function Speaker({ source }) {
    const audioRef = useRef(null);

    useEffect(() => {
        if (source) {
            source = source.replace('@', '');
            PlayAudio(source);
        }
    }, [source]);

    return (
        <>
        </>
    )
}