import React, {useState} from "react";
import Sound from "react-sound";
import winxp from "../sounds/winxp.mp3";

const PlaySound = (
    handleSongLoading,
    handleSongPlaying,
    handleSongFinishedPlaying
) => {
    const [isPlaying, setIsPlaying] = useState(true);
    return (
        <div>
            <button onClick={()=>setIsPlaying(!isPlaying)} >{!isPlaying ? 'Play': 'Stop' }</button>
            <Sound
                url={"../sounds/winxp.mp3"}
                playStatus={Sound.status.playing}
            />
        </div>
    );
};

export default PlaySound;
