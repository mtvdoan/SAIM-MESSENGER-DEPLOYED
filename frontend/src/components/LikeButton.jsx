import React, { useState } from "react";

const LikeButton = () => {
    const [likes, setLikes] = useState("♡ ");
    const [isClicked, setIsClicked] = useState(false);
    const [clickCount, setClickCount] = useState(0);
    const handleClick = () => {
        if (isClicked) {
            setLikes("♡ ");
        } else {
            setLikes("❤️");
            setClickCount(0 + 1)
        }
        setIsClicked(!isClicked);
    };
    return (
        <>
            <div className="grid grid-cols-2 content-center">
                <button className={`like-button ${isClicked && "liked"}`} onClick={handleClick} disabled={isClicked}>
                <div className="likes-counter whitespace-nowrap">{`Like | ${likes}`}</div>
                </button>
                <p> {clickCount} like &#40;s&#41;</p>
            </div>
        </>
    );
};

export default LikeButton;